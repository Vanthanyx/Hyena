function synchronize() {
    const keys = Object.keys(localStorage)
    let localStorageValues = {}
    keys.forEach((key) => {
        localStorageValues[key] = localStorage.getItem(key)
    })
    //console.log(localStorageValues['modsDir'])

    /*const index = require('./index.js')
    const checker = require('./checker.js')
    const updater = require('./updater.js')*/

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
        'https://raw.githubusercontent.com/Vanthanyx/Raptor/master/cdn/database.json'
    webDBFetch(jsonURL)

    const modsDir = localStorage.getItem('modsDir')
    if (typeof localStorage !== 'undefined') {
        // Check if modsDir is set in localStorage
        if (modsDir) {
            // Read the directory
            fs.readdir(modsDir, (err, files) => {
                if (err) {
                    JSAlert.alert('Error reading directory:', err)
                    return
                }
                const scmpFiles = files.filter((fileName) =>
                    fileName.includes('SCMP')
                )

                if (scmpFiles.length > 0) {
                    scmpFiles.forEach((file) => {
                        const versionMatch = file.match(
                            /SCMP-(\d+\.\d+\.\d+)\.jar/
                        )
                        if (versionMatch && versionMatch[1]) {
                            console.log(
                                `File: ${file}, Version: ${versionMatch[1]}`
                            )
                            localStorage.setItem(
                                'modpackVersion',
                                versionMatch[1]
                            )
                        } else {
                            console.log(`File: ${file}, Version: Not found`)
                        }
                    })
                } else {
                    console.log('No SCMP files found in the mods directory.')
                    const button = document.getElementById('installButton')
                    button.removeAttribute('disabled')
                }
            })
        } else {
            console.log('modsDir is not set in localStorage.')
        }
    } else {
        console.log('localStorage is not available in this environment.')
    }

    const isUpdaterEnabled = localStorage.getItem('updater') === 'true'
    if (!modsDir) {
        JSAlert.alert('Please specify a mods folder to continue.')
        location.href = './content/settings.html'
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

    setTimeout(() => {
        JSAlert.alert('Synchronization Complete.')
    }, 1500)
}
