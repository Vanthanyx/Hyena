const fetch = require('node-fetch')
const path = require('path')

async function downloadFiles(links, folderPath) {
    try {
        // Check if the folder exists, if not, create it
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }

        // Iterate through the links array
        for (let i = 0; i < links.length; i++) {
            const link = links[i]
            const fileName = path.basename(link) // Extract file name from the URL

            const response = await fetch(link)
            if (!response.ok) {
                throw new Error(
                    `Failed to download ${fileName}: ${response.status} ${response.statusText}`
                )
            }

            const fileStream = fs.createWriteStream(
                path.join(folderPath, fileName)
            )
            await new Promise((resolve, reject) => {
                response.body.pipe(fileStream)
                response.body.on('error', (err) => {
                    reject(err)
                })
                fileStream.on('finish', function () {
                    resolve()
                })
            })

            console.log(`File ${fileName} downloaded successfully.`)
        }
    } catch (error) {
        console.error('Error downloading files:', error)
    }
}
