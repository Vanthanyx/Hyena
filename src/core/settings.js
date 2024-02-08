const fs = require('fs')
const path = require('path')

function saveData(uuid, modsDir) {
    if (uuid && uuid.length > 0) {
        localStorage.setItem('uuid', uuid)
        console.log(`"uuid" set to "${uuid}"`)
    }

    if (
        modsDir &&
        fs.existsSync(modsDir) &&
        fs.statSync(modsDir).isDirectory()
    ) {
        localStorage.setItem('modsDir', modsDir)
        console.log(`"modsDir" set to "${modsDir}"`)
        searchFilesForWord(modsDir, 'starcore')
    } else {
        console.log('Directory does not exist!')
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
                    console.log(`Found mod version: ${fileName}`)
                    localStorage.setItem('modVersion', fileName)
                    console.log(`"modVersion" set to "${fileName}"`)
                    localStorage.setItem('updater', true)
                    console.log('"updater" set to true')
                }
            }
        })
    } catch (err) {
        console.error(`Error searching files: ${err}`)
    }
}

async function getId(playername) {
    try {
        const response = await fetch(
            `https://api.minetools.eu/uuid/${playername}`
        )
        const data = await response.json()
        console.log(data.name)
        return data.id
    } catch (error) {
        console.error('Error fetching UUID:', error)
        return null
    }
}

// Example usage:
getId('514c79897f4844c3b6b3c22332b9da9f').then((uuid) => {
    if (uuid) {
        console.log(`UUID: ${uuid}`)
    } else {
        console.log('UUID not found for playername "Vanthanyx".')
    }
})
