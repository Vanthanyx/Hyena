const path = require('path')
const axios = require('axios')

// Function to download a file from a URL and save it to a specified folder
async function downloadFile(url, folderPath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer', // Use 'arraybuffer' to handle binary data
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
                    alert('Download complete!')
                }
            },
        })

        const fileName = path.basename(url)
        const filePath = path.join(folderPath, fileName)

        fs.writeFileSync(filePath, Buffer.from(response.data)) // Convert ArrayBuffer to Buffer

        console.log(`File downloaded to: ${filePath}`)
    } catch (error) {
        console.error(`Error downloading file: ${error.message}`)
        throw error
    }
}
