const { exec } = require('child_process')

function getPingAverage(ipAddress, count = 5) {
    return new Promise((resolve, reject) => {
        // Execute the ping command to ping the IP address
        exec(`ping -n ${count} ${ipAddress}`, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return
            }

            try {
                // Parse the output to extract response times
                const responseTimes = stdout
                    .trim()
                    .split('\n')
                    .slice(2, -2) // Remove header and summary lines
                    .map((line) => {
                        const match = line.match(/time=(\d+)/)
                        return match ? parseInt(match[1]) : null
                    })
                    .filter((time) => time !== null) // Filter out null values

                if (responseTimes.length === 0) {
                    reject('No response times found in output')
                    return
                }

                // Calculate the average response time
                const averageResponseTime =
                    responseTimes.reduce((acc, curr) => acc + curr, 0) /
                    responseTimes.length

                // Resolve the promise with the average response time
                resolve(averageResponseTime)
            } catch (parseError) {
                reject(parseError)
            }
        })
    })
}
