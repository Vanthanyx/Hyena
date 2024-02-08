document.addEventListener('DOMContentLoaded', function () {
    function setValueIfNotNull(key, elementId) {
        var value = localStorage.getItem(key)
        if (value !== null) {
            var element = document.getElementById(elementId)
            if (element) {
                element.textContent = value
            } else {
                console.log('Element with ID "' + elementId + '" not found.')
            }
        }
    }

    var modsDirValue = localStorage.getItem('modsDir') || 'NONE'
    var modsDirElement = document.getElementById('modsDir')
    if (modsDirElement) {
        modsDirElement.textContent = modsDirValue
    } else {
        console.log('Element with ID "modsDir" not found.')
    }

    setValueIfNotNull('uuid', 'user')
    setValueIfNotNull('modVersion', 'modVersion')

    if (localStorage.getItem('updater')) {
        // Do something if updaterValue exists
    }
})
