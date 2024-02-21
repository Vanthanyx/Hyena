const fs = require('fs')
const path = require('path')

function saveData(modsDir) {
    if (
        modsDir &&
        fs.existsSync(modsDir) &&
        fs.statSync(modsDir).isDirectory()
    ) {
        localStorage.setItem('modsDir', modsDir)
        console.log(`Set ModsDir: "${modsDir}"`)
    } else {
        console.log('ModsDir does not exist!')
        alert('That mods folder does not exist!')
    }
}
