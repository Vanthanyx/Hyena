function synchronize() {
    const syncBtn = document.getElementById('synchronizeBtn')
    syncBtn.disabled = true
    syncBtn.classList.remove('is-light')
    syncBtn.classList.add('is-loading')

    const keys = Object.keys(localStorage)
    let localStorageValues = {}
    keys.forEach((key) => {
        localStorageValues[key] = localStorage.getItem(key)
    })

    const keysBefore = keys.length

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
        'https://raw.githubusercontent.com/Vanthanyx/Raptor/master/cdn/database.json'
    webDBFetch(jsonURL)

    const keysAfter = keys.length
    if (keysBefore === keysAfter) {
        console.log(keys.length + ': No new data found.')
    } else {
        console.log(keysBefore + ' -> ' + keysAfter + ': New data found.')
    }

    setTimeout(() => {
        JSAlert.alert('Synchronization Complete.', null, JSAlert.Icons.Success)
        syncBtn.disabled = false
        syncBtn.classList.add('is-light')
        syncBtn.classList.remove('is-loading')
    }, 3000)
}
