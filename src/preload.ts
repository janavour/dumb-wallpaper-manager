import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('myAPI', {
    openBrowserWindow: (url: string) => ipcRenderer.send('open-browser-window', url),
    getPictureList: () => ipcRenderer.invoke('get-picture-list'),
    getWallpapersPath: () => ipcRenderer.invoke('get-wallpapers-path'),
    minimize: () => ipcRenderer.send('minimize'),
    maximizeOrRestore: () => ipcRenderer.send('maximize-or-restore'),
    setSettings: (settings: object) => ipcRenderer.send('set-settings', settings)
})
