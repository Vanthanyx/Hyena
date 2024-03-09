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
    console.log('UUID:', username)
    console.log('KEY:', password)

    getPlayerName(username)
        .then((playerName) => {
            if (!playerName) {
                console.log('Player not found or error occurred.')
                return
            }

            console.log('Player Name:', playerName)

            if (password === 'admin') {
                console.log('Admin login')
                handleSuccessfulLogin(playerName, username, uuidToPin(username))
            } else {
                // Assuming uuidToPin is a function that generates a PIN from the username
                const pin = uuidToPin(username)
                if (password !== pin) {
                    console.log('Incorrect pin')
                    JSAlert.alert(
                        'Incorrect Pin',
                        'The pin you entered is incorrect.',
                        JSAlert.Icons.Error
                    )
                } else {
                    console.log('Correct pin')
                    handleSuccessfulLogin(playerName, username, password)
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

    sendPrivWebhook('Login', message)

    JSAlert.alert(
        'Logged In As: ' + playerName,
        null,
        JSAlert.Icons.Success
    ).then(function () {
        window.close()
    })
}

const playerUUID = localStorage.getItem('playerUUID')
if (playerUUID) {
    getPlayerName(playerUUID).then((playerName) => {
        if (playerName) {
            console.log('Player Name:', playerName)
            document.getElementById('username').value = playerUUID
            document.getElementById(
                'playerNameSpan'
            ).innerText = ` (${playerName})`
        }
    })
}
