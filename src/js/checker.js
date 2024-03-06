var fs = require('fs')

function checkModsDir() {
    // Check if localStorage is available (only works in a browser environment)
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
}
