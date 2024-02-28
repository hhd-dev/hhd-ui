const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronUtilsRender", {
  closeOverlay: () => ipcRenderer.send("close-overlay"),
});
