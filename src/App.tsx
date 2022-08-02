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
        <fieldset>
            <legend>Downloaded wallpapers</legend>
            { wallpaperBrowser }
        </fieldset>
        
        <button id="download-new-wallpapers-btn" 
        onClick={() => {
            window.myAPI.openBrowserWindow('https://www.unsplash.com/wallpapers')
        }}>Download new wallpapers</button>

        <div className="hor">
            <span>Change wallpaper every</span>
            <div className="select">
                <select id="time-select" className="standard-select">
                    <option value={5}>5 sec</option>
                    <option value={60}>1 min</option>
                    <option value={3 * 60}>3 min</option>
                    <option value={5 * 60}>5 min</option>
                    <option value={10 * 60}>10 min</option>
                    <option value={15 * 60}>15 min</option>
                    <option value={30 * 60}>30 min</option>
                    <option value={60 * 60}>1 h</option>
                    <option value={3 * 60 * 60}>3 h</option>
                    <option value={6 * 60 * 60}>6 h</option>
                </select>
            </div>

        </div>

        <div className="hor">
            <span>Change wallpapers in random order</span>
            <input id="random-order-checkbox" type="checkbox"></input>
        </div>

        <div className="hor">
            <span>Select wallpaper position</span>
            <div className="select">
                <select className="standard-select">
                    <option value="fill">Fill</option>
                </select>
            </div>
        </div>

        <button onClick={() => {
            const timeSelectEl = document.getElementById('time-select') as HTMLSelectElement
            const randomOrderEl = document.getElementById('random-order-checkbox') as HTMLInputElement
            window.myAPI.setSettings({
                wallpaperChangeTime: parseInt(timeSelectEl.value),
                randomOrder: randomOrderEl.checked,
            })
        }}>Apply</button>
        </>
    )
})

