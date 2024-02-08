document.addEventListener('DOMContentLoaded', function () {
    function setValueIfNotNull(key, elementId) {
        const value = localStorage.getItem(key)
        const element = document.getElementById(elementId)
        if (value !== null && element) {
            element.textContent = value
        } else if (!element) {
            console.log('Element with ID "' + elementId + '" not found.')
        }
    }

    const modsDirValue = localStorage.getItem('modsDir') || 'NONE'
    const modsDirElement = document.getElementById('modsDir')
    if (modsDirElement) {
        modsDirElement.textContent = modsDirValue
    }

    setValueIfNotNull('modpackVersion', 'modVersion')
})

function webDBFetch(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network Not OK')
            }
            return response.json()
        })
        .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(
                    key,
                    Array.isArray(value) ? JSON.stringify(value) : value
                )
            })
            console.log('WebDB Stored.')
        })
        .catch((error) => {
            console.error('Problem With WebDB: ', error)
        })
}

const jsonURL =
    'https://raw.githubusercontent.com/Vanthanyx/Hyena/master/cdn/database.json'
webDBFetch(jsonURL)
