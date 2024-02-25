const { app, BrowserWindow, screen, protocol } = require("electron");
const path = require("path");
const homeDir = app.getPath("home");
const fs = require("fs");

const createMainWindow = async () => {
  isSteamUi = process.env.SteamGamepadUI;
  isQamUi = process.env.STEAM_QAM;

  // Get scale factor for steamui
  let scaleFactor;
  const { width, height } = screen.getPrimaryDisplay().size;

  if (isSteamUi) {
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
    ...(isSteamUi || isQamUi
      ? { width: width, height: height, transparent: true }
      : { width: 1280, height: 800 }),
    show: false,
    backgroundColor: "#1a202c",
    icon: path.join(__dirname, "./icon/android-chrome-512x512.png"),
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      zoomFactor: scaleFactor,
    },
  });
  mainWindow.setMenu(null);
  if (isQamUi) mainWindow.setBackgroundColor("#00000000");

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
    const data = fs.readFileSync(`${homeDir}/.config/hhd/token`, {
      encoding: "utf8",
      flag: "r",
    });

    const cmd =
      `localStorage.setItem("hhd_token", "${data}");` +
      `localStorage.setItem("hhd_logged_in", "true");` +
      `localStorage.setItem("hhd_electron", "true");`;
    await mainWindow.webContents.executeJavaScript(cmd);

    // Navigate to login
    await mainWindow.loadURL(startURL + (isQamUi ? "#/ui?qam=1" : "#/ui"));
  } catch (err) {
    console.log("Token file not found, skipping autologin.");
  }

  await mainWindow.whenReady;

  mainWindow.webContents.zoomFactor = scaleFactor;
  mainWindow.show();
};

app.whenReady().then(() => createMainWindow());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
