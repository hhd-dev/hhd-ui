"use strict";

const { app, BrowserWindow, screen, protocol, ipcMain } = require("electron");
const path = require("path");
const homeDir = app.getPath("home");
const fs = require("fs");
const readline = require("readline");

const calculateWindowZoom = () => {
  const isSteamUi = process.env.SteamGamepadUI;
  const isOverlayUi = process.env.STEAM_OVERLAY;
  const useNativeRes = !process.env.HHDUI_SUBSAMPLE;

  // Get scale factor for steamui
  let scaleFactor;
  let { width, height } = screen.getPrimaryDisplay().size;

  const ZOOM_RATIO = 1.1;
  const MAX_RATIO = 2;
  const RESOLUTION_BOOST = 1.3;

  if (isSteamUi || isOverlayUi) {
    if (useNativeRes) {
      // Assume we are on a screen the size of the deck
      // And add a bit of zoom even for that
      // This will launch in the panel's native resolution (laggy)
      scaleFactor = (ZOOM_RATIO * width) / 1280;
      scaleFactor = scaleFactor > 3 ? 3 : scaleFactor;
      console.error(
        "Launching in native resolution in steamui. Zoom factor: " + scaleFactor
      );
    } else {
      // Scale the display to be 30% more dense than the steam deck
      // Then apply the rest as scaling
      // Helps with performance
      let ratio = width / 1280 / RESOLUTION_BOOST;
      scaleFactor = ZOOM_RATIO * RESOLUTION_BOOST;
      if (ratio < 1) {
        ratio = 1;
      } else if (ratio > MAX_RATIO) {
        scaleFactor = (ZOOM_RATIO * ratio) / MAX_RATIO;
        scaleFactor = Math.round(10 * scaleFactor) / 10;
        ratio = MAX_RATIO;
      }

      width = Math.round(width / ratio);
      height = Math.round(height / ratio);
      console.error(
        `Launching in steamui in resolution ${width}x${height}. Zoom factor: ${scaleFactor}.`
      );
    }
  } else {
    scaleFactor = 1.0;
  }

  return { width, height, scaleFactor, isSteamUi, isOverlayUi };
};

const createMainWindow = async () => {
  let { width, height, scaleFactor, isSteamUi, isOverlayUi } =
    calculateWindowZoom();

  let mainWindow = new BrowserWindow({
    ...(isSteamUi || isOverlayUi
      ? {
          width: width,
          height: height,
          fullscreen: isOverlayUi,
          resizable: false,
        }
      : { width: 1280, height: 800 }),
    show: false,
    ...(isOverlayUi && { transparent: true }),
    backgroundColor: "#1a202c",
    icon: path.join(__dirname, "./art/icon.png"),
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      zoomFactor: scaleFactor,
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  mainWindow.on("will-resize", function () {
    const size = mainWindow.getSize();
    const width = size[0];
    const height = size[1];
    console.error("width: " + width);
    console.error("height: " + height);
  });
  mainWindow.on("resized", function () {
    const size = mainWindow.getSize();
    const width = size[0];
    const height = size[1];
    console.error("resized");
    console.error("width: " + width);
    console.error("height: " + height);
  });

  mainWindow.setMenu(null);
  if (isOverlayUi) mainWindow.setBackgroundColor("#00000000");

  fileProtocolRedirect();

  // Load a proper webpage so js can run
  const startURL = require("url").format({
    protocol: "file",
    slashes: true,
    // pathname: require("node:path").join(__dirname, "./static/build/index.html"),
    pathname: "index.html",
  });
  await mainWindow.loadURL(startURL);

  // Set appropriate initial state for the app
  let cmd;
  if (isOverlayUi) {
    cmd =
      `window.electronUtils.setUiType("closed");` +
      `window.electronUtils.setAppType("overlay");`;
  } else {
    cmd = `window.electronUtils.setAppType("app");`;
  }
  await mainWindow.webContents.executeJavaScript(cmd);

  // Attempt to autologin with user token
  try {
    console.error(`Checking dir '${homeDir}' for the user token.`);
    const token = fs.readFileSync(`${homeDir}/.config/hhd/token`, {
      encoding: "utf8",
      flag: "r",
    });

    const cmd = `window.electronUtils.login("${encodeURI(token)}");`;
    await mainWindow.webContents.executeJavaScript(cmd);
  } catch (err) {
    console.error("Token file not found, skipping autologin.");
  }

  await mainWindow.whenReady;

  mainWindow.webContents.zoomFactor = scaleFactor;
  mainWindow.show();

  // Handle Overlay Communication
  // after this point. In case of no overlay, allow hiding and showing.
  const rl = readline.createInterface({
    input: process.stdin,
  });
  if (!isOverlayUi) {
    rl.on("line", (line) => {
      if (!line.startsWith("cmd:toggle-visibility")) return;
        console.error("Restoring window.");
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
        mainWindow.focus();
      } else if (!mainWindow.isFocused()) {
        console.error("Focusing window.");
        mainWindow.focus();
      } else {
        console.error("Minimizing window.");
        mainWindow.minimize();
      }
    });
    ipcMain.on("update-status", (_, stat) => {
      if (stat === "minimize") {
        mainWindow.minimize();
      }
    });
    return;
  }

  let currentType = "closed";
  let qam_preopened = false;
  let grab_interval = null;

  const writeSync = (cmd) => {
    console.log(cmd);
  };

  // Inform hhd of the new status
  ipcMain.on("update-status", (_, stat) => {
    currentType = stat;
    const should_grab = stat !== "closed";
    writeSync(`stat:${stat}`);

    if (should_grab) {
      if (!grab_interval)
        grab_interval = setInterval(() => writeSync(`grab:enable`), 2000);
      writeSync(`grab:enable`);
    } else {
      if (grab_interval) {
        clearInterval(grab_interval);
        grab_interval = null;
      }
      writeSync(`grab:disable`);
    }
  });

  const processCmd = (cmd) => {
    let uiType = null;
    switch (cmd) {
      case "open_qam_if_closed":
        // Preopen qam when the qam button is pressed a second
        // time to minimize delay
        if (currentType === "closed") uiType = "qam";
        break;
      case "open_qam":
        // If the user presses QAM again close
        if (currentType === "qam" && !qam_preopened) {
          console.error("QAM is currently open, closing.");
          uiType = "closed";
        } else {
          uiType = "qam";
        }
        break;
      case "open_overlay":
      case "open_expanded":
        // If the user presses QAM for expanded and we are expanded close
        if (currentType === "expanded") {
          console.error("Currently expanded, closing.");
          uiType = "closed";
        } else {
          uiType = "expanded";
        }
        break;
      case "open_notification":
        uiType = "notification";
        break;
      case "close":
        uiType = "closed";
        break;
      case "close_now":
        uiType = "closed";
        if (grab_interval) {
          clearInterval(grab_interval);
          grab_interval = null;
        }
        writeSync(`stat:closed`);
        writeSync(`grab:disable`);
        break;
    }
    if (!uiType) return;

    // Remember if qam was pre-opened to avoid
    // closing it after the button is released
    qam_preopened = cmd === "open_qam_if_closed";

    if (mainWindow) {
      console.error(`Switching ui to '${uiType}'`);
      mainWindow.webContents.executeJavaScript(
        `window.electronUtils.setUiType("${uiType}");`
      );
    }
  };

  const processAction = (action) => {
    console.error(action);
    const cmd = `window.electronUtils.sendGamepadEvent("${encodeURI(
      action
    )}");`;
    mainWindow.webContents.executeJavaScript(cmd);
  };

  // Receive open and close commands
  rl.on("line", (line) => {
    console.error(line);
    if (line.startsWith("cmd:")) processCmd(line.trim().substring(4));
    else if (line.startsWith("action:"))
      processAction(line.trim().substring(7));
  });
};

function fileProtocolRedirect() {
  // Redirect local files to proper path
  // TODO: Fix this. Probably insecure.
  protocol.interceptFileProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(7); /* all urls start with 'file://' */
      callback({
        path: path.normalize(`${__dirname}/static/build/${url}`.split("#")[0]),
      });
    },
    (err) => {
      if (err) console.error("Failed to register protocol");
    }
  );
}

(() => {
  const argv = process.argv;
  if (argv && argv.length) {
    const last = argv[argv.length - 1];
    if (last === "--version") {
      console.log(app.getVersion());
      app.quit();
      return;
    }
  }

  app.whenReady().then(() => createMainWindow());

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
})();
