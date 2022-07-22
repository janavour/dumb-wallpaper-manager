export interface IMyAPI {
    openBrowserWindow: (url: string) => void,
    getPictureList: () => Promise,
    getWallpapersPath: () => Promise,
    minimize: () => void,
    maximize: () => void,
    setWallpaperChangeTime: () => void,
}

declare global {
    interface Window {
        myAPI: IMyAPI
    }
}