import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { setWallpaper } from 'wallpaper'

const fs = require('fs')
const { execSync, exec } = require('child_process')

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

let mainWindow: BrowserWindow
let wallpaperChangeTime: number // In seconds
let randomOrder: boolean
let currentWallpaperIndex = 0

let wallpaperInterval: NodeJS.Timer
let tray: Tray


const createWindow = (): void => {
  if (tray !== undefined && !tray.isDestroyed()) {
    tray.destroy()
  }
  mainWindow = new BrowserWindow({
    height: 700,
    width: 1000,
    frame: false,
    icon: './src/icons/icon.png',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

app.on('ready', () => {
  ipcMain.on('open-browser-window', handleOpenBrowserWindow)
  ipcMain.on('minimize', () => mainWindow.minimize())
  ipcMain.on('maximize-or-restore', () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize()
  })
  ipcMain.on('set-settings', (event: any, settings: Settings) => {
    wallpaperChangeTime = settings.wallpaperChangeTime
    clearInterval(wallpaperInterval)
    wallpaperInterval = setInterval(setNewWallpaper, wallpaperChangeTime * 1000)

    randomOrder = settings.randomOrder
  })
  ipcMain.handle('get-picture-list', handleGetPictureList)
  ipcMain.handle('get-wallpapers-path', getWallpapersPath)

  if (wallpaperChangeTime !== undefined) {
    wallpaperInterval = setInterval(setNewWallpaper, wallpaperChangeTime * 1000)
  }

  createWindow()
})

function createTrayIcon() {
  tray = new Tray('./resources/icons/icon.ico') // Don't forge to put the icon into root dir
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open app', type: 'normal', click: (menuItem, browserWindow, event) => {
      createWindow()
    }},
    { label: 'Next wallpaper', type: 'normal', click: (menuItem, browserWindow, event) => {
      setNewWallpaper()
    } },
    { label: 'Quit', type: 'normal', click: (menuItem, browserWindow, event) => {
      app.quit()
    }},
  ])
  tray.setToolTip('Wallpaper Manager')
  tray.setContextMenu(contextMenu)
  tray.on('click', (event, bounds, position) => createWindow())
  // tray.displayBalloon({title: 'Just in case you didn\'t know', content: 'The app now is in tray.'})
}

app.on('window-all-closed', () => {
  createTrayIcon()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/************************ HANDLE FUNCTIONS ************************/
function handleOpenBrowserWindow(event: any, url: string) {
  const win = new BrowserWindow({
    height: 700,
    width: 1000,
    autoHideMenuBar: true,
    // webPreferences: {
      // preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    // },
    // frame: false,
  })

  win.webContents.session.on('will-download', (event, item, webContents) => {
    console.log(item.getFilename(), app.getPath('pictures'))
    
    item.setSavePath(getWallpapersPath() + item.getFilename())

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })

  win.once('close', () => {
    mainWindow.reload()
  })

  win.loadURL(url);
}

function handleGetPictureList() {
  const wallpapersPath = getWallpapersPath()

  if (!fs.existsSync(wallpapersPath)) {
    fs.mkdirSync(wallpapersPath)
  }

  return fs.readdirSync(wallpapersPath)
}

function getWallpapersPath() {
  if (process.platform === 'win32') 
    return app.getPath('pictures') + '\\Wallpapers\\'
  return app.getPath('pictures') + '/Wallpapers/'
}

/************************ UTILS ************************/

function setNewWallpaper() {
  const pictureList = handleGetPictureList()
  
  let selectedIndex: number
  if (randomOrder) {
    selectedIndex = getRandomInt(0, pictureList.length)
  } else {
    selectedIndex = ++currentWallpaperIndex
    if (selectedIndex >= pictureList.length) {
      selectedIndex = 0
    }
  }
  const targetWallpaperPath = getWallpapersPath() + pictureList[selectedIndex]

  if (process.platform == 'linux' && execSync('echo $XDG_CURRENT_DESKTOP').includes('XFCE')) {
    exec(`xfconf-query -c xfce4-desktop -l | grep last-image | while read path; do xfconf-query -c xfce4-desktop -p $path -s "${targetWallpaperPath}"; done`)
  } else {
    setWallpaper(targetWallpaperPath)
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // Maximum is not included, min is included
}