export interface IMyAPI {
    openBrowserWindow: (url: string) => void,
    getPictureList: () => Promise,
    getPicturesPath: () => Promise,
    minimize: () => void,
    maximize: () => void,
    setWallpaperChangeTime: () => void,
}

declare global {
    interface Window {
        myAPI: IMyAPI
    }
}