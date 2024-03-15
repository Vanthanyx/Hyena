function createCacheFile(...args) {
    const currentDate = new Date()
    const cacheData = {
        timestamp: currentDate.toISOString(),
        data: {},
    }

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i]
        const value = args[i + 1]
        if (Array.isArray(value)) {
            cacheData.data[key] = [...value]
        } else {
            cacheData.data[key] = value
        }
    }

    const fileName = localStorage.getItem('modsDir') + '\\.RDS.json'

    fs.writeFile(fileName, JSON.stringify(cacheData), 'utf8', function (err) {
        if (err) {
            console.error('Error writing cache file:', err)
            return
        }
        console.log('Cache file created successfully.')
    })
}

function appendToCacheFile(...args) {
    const fileName = localStorage.getItem('modsDir') + '\\.RDS.json'

    // Check if the cache file exists
    fs.access(fileName, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, create a new cache file
            createCacheFile(...args)
        } else {
            // Read the existing cache file
            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading cache file:', err)
                    return
                }

                // Parse the existing cache data
                let cacheData = JSON.parse(data)

                // Merge new data with the existing data
                for (let i = 0; i < args.length; i += 2) {
                    const key = args[i]
                    const value = args[i + 1]
                    if (!cacheData.data.hasOwnProperty(key)) {
                        if (Array.isArray(value)) {
                            cacheData.data[key] = [...value]
                        } else {
                            cacheData.data[key] = value
                        }
                    } else {
                        console.warn(
                            `Key "${key}" already exists in cache. Skipping.`
                        )
                    }
                }

                // Update the timestamp
                cacheData.timestamp = new Date().toISOString()

                // Write the updated cache data back to the file
                fs.writeFile(
                    fileName,
                    JSON.stringify(cacheData),
                    'utf8',
                    function (err) {
                        if (err) {
                            console.error('Error writing cache file:', err)
                            return
                        }
                        console.log('Cache file updated successfully.')
                    }
                )
            })
        }
    })
}
