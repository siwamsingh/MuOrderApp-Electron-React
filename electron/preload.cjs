
const { contextBridge, ipcRenderer } = require("electron");
const os = require('os');

contextBridge.exposeInMainWorld('electron',{
  homeDire: () => os.homedir(),
  osVersion: () => os.version(),
  arc: () => os.arch()
})

contextBridge.exposeInMainWorld('ir',{
  send: (channel,data) => ipcRenderer.send(channel,data),

  on: (channel,func) => ipcRenderer.on(channel,(events,...args)=>func(...args)),

})

