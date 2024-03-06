const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const url = require('url')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 575,
        frame: false,
        icon: path.join(__dirname, 'src/assets/icons/raptor.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
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
            height: 400,
            frame: false,
            icon: path.join(__dirname, 'src/assets/icons/raptor.png'),
            webPreferences: {
                nodeIntegration: true,
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
