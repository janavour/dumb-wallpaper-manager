import React from "react"
import "./WallpaperBrowser.css"


export default async function WallpaperBrowser() {
    const wallpapersPath = await window.myAPI.getPicturesPath() + '/Wallpapers/'

    const pictureList = await window.myAPI.getPictureList()

    const pics = pictureList.map((path: string, index: number) => {
        return <img key={`${index}`} className="wallpaper" src={wallpapersPath + path}></img>
    })


    return (
        <div className='wallpaper-browser'>
            {pics}
        </div>
    )
}
