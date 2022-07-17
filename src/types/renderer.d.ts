export interface IMyAPI {
    openBrowserWindow: (url: string) => void,
    getPictureList: () => Promise,
    getPicturesPath: () => Promise
}

declare global {
    interface Window {
        myAPI: IMyAPI
    }
}