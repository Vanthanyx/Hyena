const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 750,
        height: 500,
        frame: false,
        icon: path.join(__dirname, 'src/assets/icons/raptor_alt.png'),
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
