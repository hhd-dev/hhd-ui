const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronUtilsRender", {
  updateStatus: (status) => ipcRenderer.send("update-status", status),
});
