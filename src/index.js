const express = require('express')
const app = express()


require('dotenv').config()

process.env.PORT ??= '3000'


app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.listen(process.env.PORT, () => console.log(`Web server is listening on http://localhost:${process.env.PORT}`))