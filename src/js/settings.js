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
    } else if (keysPressed.endsWith('advxx')) {
        JSAlert.confirm('Open Advanced Settings?').then(function (result) {
            if (result) {
                window.location.href = 'advanced.html'
            }
        })
        keysPressed = ''
    } else if (keysPressed.endsWith('inpxx')) {
        JSAlert.prompt('Submit Input Key').then(function (result) {
            if (result) {
                storeDataInLocalStorage(result)
            }
        })
        keysPressed = ''
    }
}

document.addEventListener('keydown', handleKeyDown)

function storeDataInLocalStorage(dataString) {
    const [key, value] = dataString.split(':')
    if (key && value) {
        localStorage.setItem(key.trim(), value.trim())
        JSAlert.alert(
            'Data Stored <br><code>' +
                key.trim() +
                '</code><br><code>' +
                value.trim() +
                '</code>',
            null,
            JSAlert.Icons.Success
        )
    } else {
        JSAlert.alert(null, 'Invalid Format', JSAlert.Icons.Failed)
    }
}

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

function enterCode() {
    const loggedIn = localStorage.getItem('loggedIn')
    if (loggedIn !== 'true') {
        JSAlert.alert(
            'You must be logged in to enter codes!',
            'Not Logged In',
            JSAlert.Icons.Failed,
            'OK'
        )
        return
    }

    JSAlert.prompt('Enter your code:').then(function (result) {
        if (!result) return
        JSAlert.loader(`Entering code: <code>${result}</code>`).dismissIn(1500)
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
            'No results were found for that code.',
            'Invalid Code',
            JSAlert.Icons.Failed
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active')
    }

    function closeModal($el) {
        $el.classList.remove('is-active')
    }

    function closeAllModals() {
        ;(document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal)
        })
    }

    // Add a click event on buttons to open a specific modal
    ;(document.querySelectorAll('.js-modal-trigger') || []).forEach(
        ($trigger) => {
            const modal = $trigger.dataset.target
            const $target = document.getElementById(modal)

            $trigger.addEventListener('click', () => {
                openModal($target)
            })
        }
    )

    // Add a click event on various child elements to close the parent modal
    ;(
        document.querySelectorAll(
            '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
        ) || []
    ).forEach(($close) => {
        const $target = $close.closest('.modal')

        $close.addEventListener('click', () => {
            closeModal($target)
        })
    })

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllModals()
        }
    })
})
