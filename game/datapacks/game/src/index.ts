import DatapackInitializer from '/game/js/datapack.js'
import Engine from '/game/js/engine.js'
import Block from '/game/js/block.js'
import textures from './generatedTextures.js'

import Air from './blocks/Air.js'
import Bedrock from './blocks/Bedrock.js'
import Cobblestone from './blocks/Cobblestone.js'
import Dirt from './blocks/Dirt.js'
import Grass from './blocks/Grass.js'
import IronOre from './blocks/IronOre.js'
import Leaves from './blocks/Leaves.js'
import Log from './blocks/Log.js'
import Sand from './blocks/Sand.js'
import Stone from './blocks/Stone.js'
import Water from './blocks/Water.js'

class Initializer extends DatapackInitializer {
    blocks: PublicConstructor<Block>[] = [
        Air, Bedrock, Cobblestone, Dirt,
        Grass, IronOre, Leaves, Log, Sand,
        Stone, Water,
    ]

    onInitialize(): void {
        console.log('Initializing datapack "game"')
        this.registerGeneratedTextures()
        this.registerBlocks()
    }

    registerGeneratedTextures(): void {
        for (const [name, texture] of textures) {
            Engine.registerTexture(name, texture)
        }
    }

    registerBlocks(): void {
        for (const block of this.blocks) {
            Engine.registerBlock(new block())
        }
    }
}

export default Initializer