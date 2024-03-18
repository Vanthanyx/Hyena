const { app, BrowserWindow, ipcMain } = require('electron')
if (require('electron-squirrel-startup')) app.quit()
const path = require('node:path')
const url = require('url')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 915,
        height: 575,
        frame: false,
        icon: path.join(__dirname, 'src/assets/icons/rhombus_blue.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            // Set the default download directory here
            download: {
                defaultDirectory: 'Downloads',
            },
        },
    })

    mainWindow.loadFile('src/index.html')

    const appVersion = app.getVersion()
    mainWindow.webContents.send('app-version', appVersion)

    ipcMain.on('reload-app', () => {
        app.relaunch()
        app.quit()
    })

    ipcMain.on('open-login-window', () => {
        const loginWindow = new BrowserWindow({
            width: 400,
            height: 325,
            frame: false,
            icon: path.join(__dirname, 'src/assets/icons/rhombus.png'),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            },
        })

        loginWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'src/content/login.html'),
                protocol: 'file:',
                slashes: true,
            })
        )
    })

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('closeApp', () => {
    app.quit()
})
