const { ipcRenderer } = require('electron')

ipcRenderer.on('app-version', (event, version) => {
    localStorage.setItem('hardVersion', version)
})
