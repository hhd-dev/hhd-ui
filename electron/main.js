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
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
    },
  });
  const data = fs.readFileSync(`${homeDir}/.config/hhd/token`, {
    encoding: "utf8",
    flag: "r",
  });

  setTimeout(() => {
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
  }, 0);

  await mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("hhd_token", "${data}");`,
    true
  );
  await mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("hhd_logged_in", "true");`,
    true
  );
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
