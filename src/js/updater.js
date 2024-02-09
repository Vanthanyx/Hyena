const isUpdaterEnabled = localStorage.getItem('updater')

if (isUpdaterEnabled) {
    console.log('Updater Enabled. Checking Updates...')
    const modpackVersion = localStorage.getItem('modpackVersion')
    const latestModpackVersion = localStorage.getItem('latestModpackVersion')
    const hardVersion = localStorage.getItem('hardVersion')
    const latestHardVersion = localStorage.getItem('latestHardVersion')
    const modsDir = localStorage.getItem('modsDir')

    if (modpackVersion !== latestModpackVersion) {
        console.log('Modpack Update Available!')
        updateModpack()
    } else if (hardVersion !== latestHardVersion) {
        console.log('Hard Update Available!')
        updateApp()
    } else {
        console.log('No Updates Available.')
    }
} else {
    console.log('Updater Disabled. Skipping Updates...')
    location.href = './content/settings.html'
    alert('Please specify a mods folder to continue.')
}

function updateModpack() {
    const result = confirm('Click OK To Update Modpack!')
    if (result) {
        console.log('Updating Modpack...')
    }
}

function updateApp() {
    const result = confirm('Click OK To Download Updater!')
    if (result) {
        console.log('Downloading Updater...')
    }
}
