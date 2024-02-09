const fs = require('fs')

document.addEventListener('DOMContentLoaded', function () {
    function setValueIfNotNull(key, elementId) {
        const value = localStorage.getItem(key)
        const element = document.getElementById(elementId)
        if (value !== null && element) {
            element.textContent = value
        } else if (!element) {
            console.log('Element with ID "' + elementId + '" not found.')
        }
    }

    const modsDirValue = localStorage.getItem('modsDir') || 'NONE'
    const modsDirElement = document.getElementById('modsDir')
    if (modsDirElement) {
        modsDirElement.textContent = modsDirValue
    }

    const installedValue = localStorage.getItem('installed')
    if (installedValue && !null) {
        const requiredFilesString = localStorage.getItem('requiredFiles')
        if (requiredFilesString) {
            const requiredFiles = JSON.parse(requiredFilesString)
            for (const file of requiredFiles) {
                if (!fs.existsSync(file)) {
                    const savePath = `modsDirValue/${file}.jar`
                    const fileUrl =
                        'https://raw.githubusercontent.com/Vanthanyx/Hyena/master/cdn/mods/' +
                        file +
                        '.jar'
                    console.log('File Not Found: ' + file)
                    download.download(
                        {
                            url: fileUrl,
                            path: savePath,
                        },
                        function (error, info) {
                            if (error) {
                                console.error('Download failed:', error)
                            } else {
                                console.log(
                                    'File downloaded successfully:',
                                    info.filePath
                                )
                            }
                        }
                    )
                }
            }
        } else {
            console.log('No required files found in localStorage.')
        }
    }

    setValueIfNotNull('modpackVersion', 'modVersion')
})

function webDBFetch(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network Not OK')
            }
            return response.json()
        })
        .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(
                    key,
                    Array.isArray(value) ? JSON.stringify(value) : value
                )
            })
            console.log('WebDB Stored.')
        })
        .catch((error) => {
            console.error('Problem With WebDB: ', error)
        })
}

const jsonURL =
    'https://raw.githubusercontent.com/Vanthanyx/Hyena/master/cdn/database.json'
webDBFetch(jsonURL)
