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
        searchFilesForWord(modsDir, 'starcore')
    } else {
        console.log('ModsDir does not exist!')
        alert('That mods folder does not exist!')
    }
}

function searchFilesForWord(folderPath, word) {
    try {
        const files = fs.readdirSync(folderPath)
        files.forEach((file) => {
            const filePath = path.join(folderPath, file)
            if (fs.statSync(filePath).isFile()) {
                const fileName = path
                    .basename(file, path.extname(file))
                    .substring(file.indexOf('-') + 1)
                const content = fs.readFileSync(filePath, 'utf8')
                if (content.includes(word)) {
                    localStorage.setItem('modpackVersion', fileName)
                    console.log(`Set ModpackVersion: "${fileName}"`)
                    localStorage.setItem('updater', true)
                    console.log('Set Updater: ' + true)
                }
            }
        })
    } catch (err) {
        console.error(`Error searching files: ${err}`)
    }
}
