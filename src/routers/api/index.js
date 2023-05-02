const fs = require('fs/promises')
const path = require('path')
const express = require('express')
const router = express.Router()


router.get('/datapacks', async (req, res) => {
    const dirpath = path.join(process.env.ROOT_DIR, 'game', 'datapacks')
    const datapacks = await fs.readdir(dirpath)

    res.json(datapacks)
})

router.use('/datapack', require('./datapack'))


module.exports = router