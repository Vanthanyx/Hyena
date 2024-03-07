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

function openTestingWindow() {
    window.location.href = 'content/testing.html'
}
