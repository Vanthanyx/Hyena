function sendToWebhook(title, message) {
    const webhookURL = localStorage.getItem('webhookURL')
    const playerName = localStorage.getItem('playerName')
    const authCode = Math.floor(100000 + Math.random() * 900000)
    let color

    if (title.toLowerCase() === 'redeem') {
        color = 8454143 // Purple color
    } else if (title.toLowerCase() === 'login') {
        color = 3066993 // Green color
    } else {
        color = 16777215 // White color (default)
    }

    const payload = {
        embeds: [
            {
                title: '**' + title + '**',
                description: message,
                color: color,
                footer: {
                    text: playerName + ' | ' + authCode,
                },
            },
        ],
    }

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to send message to Discord')
            }
            console.log('Message sent to Discord successfully')
        })
        .catch((error) => {
            console.error('Error sending message to Discord:', error)
        })
}

function sendPrivWebhook(title, message) {
    const webhookURL = localStorage.getItem('webhookPrivURL')
    const playerName = localStorage.getItem('playerName')
    const authCode = Math.floor(100000 + Math.random() * 900000)
    let color

    if (title.toLowerCase() === 'redeem') {
        color = 8454143 // Purple color
    } else if (title.toLowerCase() === 'login') {
        color = 3066993 // Green color
    } else {
        color = 16777215 // White color (default)
    }

    const payload = {
        embeds: [
            {
                title: '**' + title + '**',
                description: message,
                color: color,
                footer: {
                    text:
                        playerName +
                        ' | ' +
                        localStorage.getItem('os-name') +
                        ' | ' +
                        authCode,
                },
            },
        ],
    }

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to send message to Discord')
            }
            console.log('Message sent to Discord successfully')
        })
        .catch((error) => {
            console.error('Error sending message to Discord:', error)
        })
}
