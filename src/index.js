const path = require('path')
const express = require('express')


require('dotenv').config()

process.env.PORT ??= '3000'
process.env.ROOT_DIR = path.join(__dirname, '..')


const app = express()

app.set('json spaces', 2)

app.use('/static', express.static('static'))
app.use('/game', express.static('game'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.get('/favicon.ico', (req, res) => {
    res.sendFile('static/favicon.ico', { root: process.env.ROOT_DIR })
})

app.use('/api', require('./routers/api'))


app.listen(process.env.PORT, () => console.log(`Web server is listening on http://localhost:${process.env.PORT}`))