const { app, BrowserWindow, screen: electronScreen } = require("electron");
const path = require("path");

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 640,
    height: 360,
    show: false,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
    },
  });
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
