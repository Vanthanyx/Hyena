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
        console.log('Updater Enabled. Checking Updates...')
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
        'Please update your modpack!\n' +
            localStorage.getItem('modpackVersion') +
            ' -> ' +
            localStorage.getItem('latestModpackVersion'),
        'New Modpack Version!'
    )
}

function updateApp() {
    JSAlert.confirm('Click okay to update the app!', 'New App Version!').then(
        function (result) {
            if (!result) return
            const appUpdaterURL = localStorage.getItem('appUpdaterURL')
            const filename = 'RaptorLauncher.exe'
            downloadFile(appUpdaterURL, filename)
            JSAlert.alert('File deleted!')
        }
    )
}

function downloadFile(url, filename) {
    const anchorElement = document.createElement('a')
    anchorElement.href = url
    anchorElement.download = filename
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
}
