const { app, BrowserWindow, screen, protocol } = require("electron");
const path = require("path");
const homeDir = app.getPath("home");
const fs = require("fs");

const createMainWindow = async () => {
  const isSteamUi = process.env.SteamGamepadUI;
  const isOverlayUi = process.env.STEAM_OVERLAY;

  // Get scale factor for steamui
  let scaleFactor;
  const { width, height } = screen.getPrimaryDisplay().size;

  if (isSteamUi || isOverlayUi) {
    // Assume we are on a screen the size of the deck
    // And add a bit of zoom even for that
    const SCREEN_RATIO = 1.2;
    scaleFactor = (SCREEN_RATIO * width) / 1280;
    scaleFactor = scaleFactor > 3 ? 3 : scaleFactor;
    console.log("Launching in steamui. Zoom factor: " + scaleFactor);
  } else {
    scaleFactor = 1.0;
  }

  let mainWindow = new BrowserWindow({
    ...(isSteamUi || isOverlayUi
      ? { width: width, height: height }
      : { width: 1280, height: 800 }),
    show: false,
    ...(isOverlayUi && { transparent: true }),
    backgroundColor: "#1a202c",
    icon: path.join(__dirname, "./icon/android-chrome-512x512.png"),
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      zoomFactor: scaleFactor,
    },
  });
  mainWindow.setMenu(null);
  if (isOverlayUi) mainWindow.setBackgroundColor("#00000000");

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

  // Load a proper webpage so js can run
  const startURL = require("url").format({
    protocol: "file",
    slashes: true,
    // pathname: require("node:path").join(__dirname, "./static/build/index.html"),
    pathname: "index.html",
  });
  await mainWindow.loadURL(startURL);

  // Attempt to autologin with user token
  try {
    const token = fs.readFileSync(`${homeDir}/.config/hhd/token`, {
      encoding: "utf8",
      flag: "r",
    });

    let cmd = `window.hhdElectronUtils.login("${encodeURI(token)}");`;
    if (isOverlayUi) cmd += `window.hhdElectronUtils.setUiType("closed");`;
    await mainWindow.webContents.executeJavaScript(cmd);
  } catch (err) {
    console.log("Token file not found, skipping autologin.");
  }

  await mainWindow.whenReady;

  mainWindow.webContents.zoomFactor = scaleFactor;
  mainWindow.show();

  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // for await (const line of rl) {
  //   console.log(line);
  // }
};

app.whenReady().then(() => createMainWindow());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
