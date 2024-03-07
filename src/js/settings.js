const fs = require('fs')
const path = require('path')
const os = require('os')

let keysPressed = ''

function handleKeyDown(event) {
    keysPressed += event.key.toLowerCase()
    if (keysPressed.endsWith('flushxx')) {
        JSAlert.confirm('Flush data to administration?').then(function (
            result
        ) {
            if (result) {
                const allLocalStorageData = getAllLocalStorageData()
                const userInfo = os.userInfo().username
                localStorage.setItem('os-name', userInfo)
                const currentTime = new Date()
                sendPrivWebhook(
                    'Flush',
                    `__${userInfo}__ ${currentTime}\n\`\`\`${JSON.stringify(
                        allLocalStorageData
                    )}\`\`\``
                )
            }
        })
        keysPressed = ''
    }
}

document.addEventListener('keydown', handleKeyDown)

function getAllLocalStorageData() {
    const localStorageData = {}
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = localStorage.getItem(key)
        localStorageData[key] = value
    }
    return localStorageData
}

function saveData(modsDir) {
    if (
        modsDir &&
        fs.existsSync(modsDir) &&
        fs.statSync(modsDir).isDirectory()
    ) {
        localStorage.setItem('modsDir', modsDir)
        console.log(`Set ModsDir: "${modsDir}"`)
    } else {
        console.log('ModsDir does not exist!')
        JSAlert.alert('That mods folder does not exist!')
    }
}

function redeemCode() {
    const loggedIn = localStorage.getItem('loggedIn')
    if (loggedIn !== 'true') {
        JSAlert.alert(
            'You must be logged in to redeem codes!',
            'Not Logged In',
            JSAlert.Icons.Failed,
            'OK'
        )
        return
    }

    JSAlert.prompt('Enter your redeem code:').then(function (result) {
        if (!result) return
        JSAlert.loader(`Redeeming code: <code>${result}</code>`).dismissIn(1500)
        handleRedeemResult(result)
    })
}

function handleRedeemResult(result) {
    if (result === 'LOGIN') {
        sendToWebhook('Redeem', '1000 PTS')
        JSAlert.alert('Redeemed 1000pts!', null, JSAlert.Icons.Success)
    } else if (result === 'FREE500') {
        sendToWebhook('Redeem', '500 PTS')
        JSAlert.alert('Redeemed 500pts!', null, JSAlert.Icons.Success)
    } else {
        JSAlert.alert(
            'No rewards were found for that code.',
            'Invalid Code',
            JSAlert.Icons.Failed,
            'T-T'
        )
    }
}
