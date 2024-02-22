const { app, BrowserWindow, screen: electronScreen } = require("electron");
const path = require("path");
const homeDir = app.getPath("home");
const fs = require("fs");

const createMainWindow = async () => {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    backgroundColor: "white",
    icon: "./icon/android-chrome-512x512.png",
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  mainWindow.setMenu(null);
  mainWindow.once("ready-to-show", () => mainWindow && mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Load a proper webpage so js can run
  const startURL = `file://${path.join(
    __dirname,
    "./static/build/index.html"
  )}`;

  mainWindow.loadURL(startURL);

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
    mainWindow.loadURL(startURL + "#/ui");
  } catch (err) {
    console.log("Token file not found, skipping autologin.");
  }
};

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
