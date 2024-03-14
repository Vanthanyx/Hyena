async function getPlayerName(uuid) {
    try {
        const response = await fetch(`https://api.minetools.eu/uuid/${uuid}`)
        const data = await response.json()
        // The API returns an array of name objects, we want the latest one
        const playerName = data.name
        return playerName
    } catch (error) {
        console.error('Error fetching player name:', error)
        return null
    }
}

async function getPlayerUUID(username) {
    try {
        const response = await fetch(
            `https://api.minetools.eu/uuid/${username}`
        )
        const data = await response.json()
        const playerUUID = data.id
        return playerUUID
    } catch (error) {
        console.error('Error fetching player UUID:', error)
        return null
    }
}

function uuidToPin(uuid) {
    // Extract the last 6 characters of the UUID
    const pin = uuid.substring(uuid.length - 6)

    // Convert letters to numbers
    const pinWithNumbers = pin
        .split('')
        .map((char) => {
            // Check if the character is a letter
            if (/[a-zA-Z]/.test(char)) {
                // Convert the letter to its corresponding number (A=1, B=2, ...)
                return char.toLowerCase().charCodeAt(0) - 96
            }
            return char // Return unchanged if not a letter
        })
        .join('')

    return pinWithNumbers
}

function handleSuccessfulLogin(playerName, username, password) {
    localStorage.setItem('playerName', playerName)
    localStorage.setItem('playerUUID', username)
    localStorage.setItem('playerKEY', password)
    localStorage.setItem('loggedIn', true)

    const message =
        'New Player Login\n' +
        playerName +
        ': `' +
        username +
        ':' +
        password +
        '`'

    const loggedIn = localStorage.getItem('loggedIn')
    if (!loggedIn) {
        sendPrivWebhook('Login', message)
    }

    JSAlert.alert(
        'Logged In As: ' + playerName,
        null,
        JSAlert.Icons.Success
    ).then(function () {
        window.close()
    })
}

const playerName = localStorage.getItem('playerName')
if (playerName) {
    console.log('Player Name:', playerName)
    document.getElementById('username').value = playerName
    document.getElementById('playerNameSpan').innerText = ` (${playerName})`
}

const mysql = require('mysql')

// Create a connection to the database
const connection = mysql.createConnection({
    host: '104.234.220.137',
    user: 'u477_EJRj4YFNz7',
    password: '2maj9rGF@qCDw^=@CbHPIrmp',
    database: 's477_MAIN',
})

// Function to check the database for a matching entry with SN and PIN
function checkDatabase(SN, PIN) {
    return new Promise((resolve, reject) => {
        // Construct the SQL query
        const query = `SELECT * FROM players WHERE SN = ? AND PIN = ?`

        // Execute the query
        connection.query(query, [SN, PIN], (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}
