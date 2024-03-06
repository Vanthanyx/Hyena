const fs = require('fs')
const path = require('path')

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
    console.log('Logged In:', loggedIn)
    if (loggedIn !== 'true') {
        JSAlert.alert(
            'You must be logged in to redeem codes!',
            'Not Logged In',
            JSAlert.Icons.Failed,
            'OK'
        )
        return
    } else {
        JSAlert.prompt('Enter your redeem code:').then(function (result) {
            if (!result) return
            JSAlert.loader(
                'Redeeming code: <code>' + result + '</code>'
            ).dismissIn(1500)
            if (result === 'FREE1000') {
                sendToWebhook('Redeem', "message: 'Redeemed 1000&curren;!'")
                JSAlert.alert(
                    'Redeemed 1000&curren;!',
                    null,
                    JSAlert.Icons.Success
                )
            } else if (result === 'FREE500') {
                JSAlert.alert(
                    'Redeemed 500&curren;!',
                    null,
                    JSAlert.Icons.Success
                )
            } else {
                JSAlert.alert(
                    'No rewards were found for that code.',
                    'Invalid Code',
                    JSAlert.Icons.Failed,
                    'T-T'
                )
            }
        })
    }
}
