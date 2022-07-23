export interface IMyAPI {
    openBrowserWindow: (url: string) => void,
    getPictureList: () => Promise,
    getWallpapersPath: () => Promise,
    minimize: () => void,
    maximizeOrRestore: () => void,
    setSettings: (settings: Settings) => void,
}

declare global {
    interface Window {
        myAPI: IMyAPI
    }
}