const path = require('path')
const axios = require('axios')
const JSZip = require('jszip')

async function downloadFile(url, folderPath) {
    try {
        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            throw new Error('Invalid URL provided.')
        }

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                document.getElementById('downloadProgress').value =
                    percentCompleted
                if (percentCompleted === 100) {
                    document
                        .getElementById('downloadProgress')
                        .classList.add('is-success')
                    JSAlert.loader(
                        "Please wait, we're processing your request..."
                    ).dismissIn(4000)
                    setTimeout(function () {
                        document.getElementById(
                            'downloadProgress'
                        ).removeAttribute
                    }, 5000)
                }
            },
        })

        const fileName = path.basename(url)
        const filePath = path.join(folderPath, fileName)

        fs.writeFileSync(filePath, Buffer.from(response.data))

        console.log(`File downloaded to: ${filePath}`)

        // Unzip the downloaded file
        await unzipFile(filePath, folderPath)

        // Delete the zip file
        fs.unlinkSync(filePath)
        console.log(`Deleted zip file: ${filePath}`)

        createCacheFile(
            'modpackVersion',
            localStorage.getItem('modpackVersion')
        )

        const found503Logs = searchConsoleFor503()
        if (found503Logs) {
            console.log('Occurrences of "503" in console:')
            console.log(found503Logs)
        } else {
            console.log('No occurrences of "503" found in console.')
            setTimeout(() => {
                JSAlert.alert('Download complete!')
                const progressBar = document.getElementById('downloadProgress')
                progressBar.remove()
            }, 3000)
        }
    } catch (error) {
        console.error(`Error downloading file: ${error.message}`)
        throw error
    }
}

async function unzipFile(zipFilePath, targetFolder) {
    try {
        const zip = new JSZip()
        const zipData = await zip.loadAsync(fs.readFileSync(zipFilePath))

        // Create a folder for extraction
        const extractionFolder = targetFolder

        // Extract all files
        await Promise.all(
            Object.keys(zipData.files).map(async (filename) => {
                const fileData = await zipData.files[filename].async(
                    'nodebuffer'
                )
                fs.writeFileSync(
                    path.join(extractionFolder, filename),
                    fileData
                )
            })
        )

        console.log('File unzipped successfully.')
    } catch (error) {
        console.error('Error unzipping file:', error)
        throw error
    }
}

function searchConsoleFor503() {
    const logs = console.history || [] // Check if console.history is available

    const foundLogs = logs.filter((log) => {
        return log.message && log.message.includes('503')
    })

    return foundLogs.length > 0 ? foundLogs : null
}
