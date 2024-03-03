const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronUtilsRender", {
  updateStatus: (status) => ipcRenderer.send("update-status", status),
  gamepadButtonPress: (buttonName) =>
    ipcRenderer.send("gamepadButtonPress", buttonName),
});
