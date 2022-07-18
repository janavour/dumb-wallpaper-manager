import React from "react"
import { createRoot } from "react-dom/client"
import WallpaperBrowser from './WallpaperBrowser'
import "./App.css"

const reactContainer = document.getElementById("root")

document.getElementById('close-button').onclick = window.close
document.getElementById('max-button').onclick = window.myAPI.maximizeOrRestore
document.getElementById('min-button').onclick = window.myAPI.minimize


const root = createRoot(reactContainer)
let wallpaperBrowser
WallpaperBrowser().then((val: any) => {
    wallpaperBrowser = val
    
    root.render(
        <>
        { wallpaperBrowser }
        <button>Download new wallpapers</button>

        <div className="hor">
            <span>Change wallpaper every</span>
            <select>
                <option>10 min</option>
            </select>
        </div>

        <div className="hor">
            <span>Change wallpapers in random order</span>
        </div>

        <div className="hor">
            <span>Select wallpaper position</span>
            <div className="select">
                <select className="standard-select">
                    <option value="fill">Fill</option>
                </select>
            </div>
        </div>

        <button>Apply</button>
        </>
    )
})

