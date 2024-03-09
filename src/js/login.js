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

function runLogin(username, password) {
    console.log('Running Login...')
    console.log('Username:', username)
    console.log('KEY:', password)

    getPlayerUUID(username)
        .then(async (playerUUID) => {
            if (!playerUUID) {
                console.log('Player not found or error occurred.')
                return
            }

            console.log('Player UUID:', playerUUID)

            if (password === 'admin') {
                console.log('Admin login')
                handleSuccessfulLogin(username, playerUUID, uuidToPin(username))
            } else if (password === 'admin:user') {
                console.log('Admin login w/ username')
                const playerName = await getPlayerName(playerUUID)
                handleSuccessfulLogin(
                    playerName,
                    playerUUID,
                    uuidToPin(username)
                )
            } else {
                // Assuming uuidToPin is a function that generates a PIN from the username
                const pin = uuidToPin(playerUUID)
                if (password !== pin) {
                    console.log('Incorrect pin')
                    JSAlert.alert(
                        'The auth key you entered is incorrect.',
                        'Incorrect Authentication',
                        JSAlert.Icons.Failed
                    )
                } else {
                    console.log('Correct pin')
                    handleSuccessfulLogin(username, playerUUID, password)
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })
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

const playerUUID = localStorage.getItem('playerUUID')
const playerKEY = localStorage.getItem('playerKEY')
if (playerUUID) {
    getPlayerName(playerUUID).then((playerName) => {
        if (playerName) {
            console.log('Player Name:', playerName)
            document.getElementById('username').value = playerName
            document.getElementById('password').value = playerKEY
            document.getElementById(
                'playerNameSpan'
            ).innerText = ` (${playerName})`
        }
    })
}
