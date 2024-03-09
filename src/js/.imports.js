const path = require('path')
const axios = require('axios')
const JSZip = require('jszip')
const fs = require('fs')
const os = require('os')
const shell = require('electron').shell

function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    }
    return date.toLocaleString('en-US', options)
}
