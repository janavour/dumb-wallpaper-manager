export {};

declare global {
    interface Window {
        myAPI: any
    }
}

declare global {
    interface Settings {
        wallpaperChangeTime: number,
        randomOrder: boolean   
    }
}