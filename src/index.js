require('dotenv').config()

const PORT = process.env.PORT || 8080

const express = require('express')
const app = express()

app.use('/public', express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.listen(PORT, () => console.log(`Web server is listening on http://localhost:${PORT}`))