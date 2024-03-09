const isUpdaterEnabled = localStorage.getItem('updater') === 'true'
const modsDir = localStorage.getItem('modsDir')

if (!modsDir) {
    JSAlert.alert(
        'Please specify a mods folder to continue.',
        null,
        null,
        'OK'
    ).then(function () {
        location.href = './content/settings.html'
    })
} else {
    if (isUpdaterEnabled) {
        const modpackVersion = localStorage.getItem('modpackVersion')
        const latestModpackVersion = localStorage.getItem(
            'latestModpackVersion'
        )
        const hardVersion = localStorage.getItem('hardVersion')
        const latestHardVersion = localStorage.getItem('latestHardVersion')

        if (modpackVersion && modpackVersion !== latestModpackVersion) {
            console.log('Modpack Update Available!')
            updateModpack()
        } else if (hardVersion && hardVersion !== latestHardVersion) {
            console.log('Hard Update Available!')
            updateApp()
        } else {
            console.log('No Updates Available.')
        }
    } else {
        console.log('Updater Disabled, Skipping Updates...')
    }
}

function updateModpack() {
    JSAlert.alert(
        'Please update your modpack!</br>' +
            localStorage.getItem('modpackVersion') +
            ' ⇒ ' +
            localStorage.getItem('latestModpackVersion'),
        'New Modpack Version!'
    )
    document.getElementById('installButton').disabled = false
}

function updateApp() {
    JSAlert.confirm('Click okay to update the app!', 'New App Version!').then(
        function (result) {
            if (!result) return
            const appUpdaterURL = localStorage.getItem('appUpdaterURL')
            const tempDir = os.tmpdir()
            const tempSubDir = path.join(tempDir, '.raptorTemp')
            const filename = path.join(tempSubDir, 'RaptorLauncher.exe')
            if (!fs.existsSync(tempSubDir)) {
                fs.mkdirSync(tempSubDir, { recursive: true })
            }

            downloadUpdater(appUpdaterURL, filename)
        }
    )
}

async function downloadUpdater(url, destinationPath) {
    setIcon()
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer',
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                console.log(percentCompleted)

                if (percentCompleted === 100) {
                    percentCompleted++
                    JSAlert.confirm(
                        'Would you like to update now?',
                        'Download Complete!'
                    ).then(function (result) {
                        if (!result) return
                        openFolder()
                        runUpdater()
                    })
                } else if (percentCompleted === 50) {
                    JSAlert.loader('Halfway there!').dismissIn(3000)
                } else if (percentCompleted === 1) {
                    JSAlert.loader('Download started!').dismissIn(3000)
                }
            },
        })

        const buffer = Buffer.from(response.data) // Convert ArrayBuffer to Buffer

        // Write the buffer data to the file
        fs.writeFileSync(destinationPath, buffer)

        console.log('File downloaded successfully:', destinationPath)
    } catch (error) {
        // Handle errors if any occur
        console.error('Error downloading file:', error)
        throw error
    }
}

function openFolder() {
    const tempDir = os.tmpdir()
    const tempSubDir = path.join(tempDir, '.raptorTemp')
    shell
        .openPath(tempSubDir)
        .then(() => console.log('Folder opened:', tempSubDir))
        .catch((error) => console.error('Error opening folder:', error))
}

function runUpdater() {
    const tempDir = os.tmpdir()
    const tempSubDir = path.join(tempDir, '.raptorTemp')
    const filename = path.join(tempSubDir, 'RaptorLauncher.exe')
    shell
        .openPath(filename)
        .then(() => console.log('Updater started:', filename))
        .catch((error) => console.error('Error starting updater:', error))

    setTimeout(() => {
        window.close()
    }, 3000)
}

function setIcon() {
    document.getElementById('raptorIcon').src = './assets/icons/spin.gif'
    document.getElementById('raptorIcon').style.borderRadius = '15px'
}
