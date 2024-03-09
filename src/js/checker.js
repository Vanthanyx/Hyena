function checkModsDir() {
    const updaterEnabled = localStorage.getItem('updater') === 'true'
    if (updaterEnabled) {
        const modsDir = localStorage.getItem('modsDir')
        const latestModpackVersion = localStorage.getItem(
            'latestModpackVersion'
        )
        const rdsJsonPath = path.join(modsDir, '.RDS.json')

        // Check if .RDS.json exists
        if (fs.existsSync(rdsJsonPath)) {
            try {
                const rdsJsonContent = fs.readFileSync(rdsJsonPath, 'utf8')
                const rdsJsonData = JSON.parse(rdsJsonContent)
                if (
                    rdsJsonData &&
                    rdsJsonData.timestamp &&
                    rdsJsonData.data &&
                    rdsJsonData.data.modpackVersion
                ) {
                    const timestamp = rdsJsonData.timestamp
                    const modpackVersion = rdsJsonData.data.modpackVersion
                    localStorage.setItem('modpackVersion', modpackVersion)
                    localStorage.setItem(
                        'modpackInstallDate',
                        formatTimestamp(timestamp)
                    )
                    console.log(
                        'Modpack version ',
                        modpackVersion,
                        ' found installed at ',
                        formatTimestamp(timestamp)
                    )
                    if (modpackVersion !== latestModpackVersion) {
                        console.log('Modpack Update Available!')
                        updateModpack()
                    }
                    return { timestamp, modpackVersion }
                } else {
                    console.error('Required fields not found in .RDS.json')
                    document
                        .getElementById('installButton')
                        .removeAttribute('disabled')
                    return null
                }
            } catch (error) {
                console.error('Error reading .RDS.json:', error)
                document
                    .getElementById('installButton')
                    .removeAttribute('disabled')
                return null
            }
        } else {
            console.log('RDS file does not exist')
            document.getElementById('installButton').removeAttribute('disabled')
            return null
        }
    }
}
