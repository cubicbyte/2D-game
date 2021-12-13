if (!global.__dirname) {
    const path = require('path')
    
    global.__dirname = path.resolve(path.dirname(''))
}

const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

const cert = fs.readFileSync('certificate/certificate.crt', 'utf8')
const key = fs.readFileSync('certificate/private.key', 'utf8')
const credentials = { cert, key }

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

httpServer.listen(80)
httpsServer.listen(443)

app.use('/', express.static('static'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})
