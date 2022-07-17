import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('myAPI', {
    openBrowserWindow: (url: string) => ipcRenderer.send('open-browser-window', url),
    getPictureList: () => ipcRenderer.invoke('get-picture-list'),
    getPicturesPath: () => ipcRenderer.invoke('get-pictures-path')
})
