import React from "react"
import "./WallpaperBrowser.css"


export default async function WallpaperBrowser() {
    console.log(await window.myAPI.getWallpapersPath())
    const wallpapersPath = 'file:///' + await window.myAPI.getWallpapersPath()

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
