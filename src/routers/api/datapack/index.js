const fs = require('fs/promises')
const path = require('path')
const express = require('express')
const router = express.Router()
const datapacksDir = path.join(process.env.ROOT_DIR, 'game', 'datapacks')


async function getDatapackInfo(datapack) {
    const manifestPath  = path.join(datapacksDir, datapack, 'manifest.json')
    const blocksDirpath = path.join(datapacksDir, datapack, 'assets', 'blocks')

    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
    const blocks = await fs.readdir(blocksDirpath)

    return {
        manifest: manifest,
        blockTextures: blocks
    }
}


/**
 * Datapack info (manifest, block textures, ...)
 */
router.get('/:datapack', async (req, res) => {
    const name = req.params.datapack
    const manifestPath = path.join(datapacksDir, name, 'manifest.json')

    try {
        await fs.access(manifestPath)
    }
    catch (err) {
        return res.status(404).json({
            error: 'Datapack not found'
        })
    }

    res.json(await getDatapackInfo(name))
})


module.exports = router