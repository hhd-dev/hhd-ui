const { app, BrowserWindow, screen: electronScreen } = require("electron");
const path = require("path");
const homeDir = app.getPath("home");
const fs = require("fs");

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
    },
  });
  fs.readFile(`${homeDir}/.config/hhd/token`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    mainWindow.webContents.executeJavaScript(
      `localStorage.setItem("hhd_token", "${data}");`,
      true
    );
    mainWindow.webContents.executeJavaScript(
      `localStorage.setItem("hhd_logged_in", "true");`,
      true
    );
  });
  mainWindow.setMenu(null);
  const startURL = `file://${path.join(
    __dirname,
    "./static/build/index.html"
  )}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
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
