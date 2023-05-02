import Texture, { GeneratedTexture, WebTexture } from './Texture.js'
import Block from './block.js'
import getKeyByValue from './utils/getByValue.js'
import './utils/compatibilityChecker.js'
import DatapackInitializer from './datapack.js'


/**
 * Main game class, basically a singleton
 */
class Engine {

    /**
     * Game block size in pixels
     */
    static readonly BLOCK_SIZE = 16
    static readonly RESERVED_TEXTURES = ['unknown']

    readonly Blocks: {[key: string]: typeof Block} = {}

    private blockIdMapping = new Map<number, string>()
    private textures = new Map<string, Texture>()

    private blockIdCounter = 0


    async setup() {

        // Register default violet-black texture for unknown textures
        this.registerTexture('unknown', new GeneratedTexture(({ ctx, canvas }) => {
            const COLOR_1 = '#000000'
            const COLOR_2 = '#ff00ff'
            const SQ_SIZE = Math.min(canvas.width, canvas.height) / 4

            // like chess board
            for (let i = 0; i < canvas.width / SQ_SIZE; i++) {
                for (let j = 0; j < canvas.height / SQ_SIZE; j++) {
                    ctx.fillStyle = (i + j) % 2 === 0 ? COLOR_1 : COLOR_2
                    ctx.fillRect(i * SQ_SIZE, j * SQ_SIZE, SQ_SIZE, SQ_SIZE)
                }
            }
        }))


        // Load datapacks
        await this.loadDatapacks()

    }



    /**
     * Get a block numerical ID by its string ID from the block ID mapping
     */
    getBlockNumericalId(blockId: string): number | null {
        return getKeyByValue(this.blockIdMapping, blockId) ?? null
    }

    /**
     * Get a block string ID by its numerical ID from the block ID mapping
     */
    getBlockId(numericalId: number): string | null {
        return this.blockIdMapping.get(numericalId) ?? null
    }



    /**
     * Register block
     * @param block block instance
     */
    registerBlock(block: Block): void {
        console.log(`Registering block "${block.id}"`)
        this.Blocks[block.id] = block.constructor as typeof Block
        this.blockIdMapping.set(this.blockIdCounter++, block.id)
    }

    /**
     * Unregister block
     */
    unregisterBlock(blockId: string): void {
        const numericalId = this.getBlockNumericalId(blockId)
        if (numericalId !== null) {
            this.blockIdMapping.delete(numericalId)
        }
    }

    /**
     * Get a block class by its string ID
     */
    getBlockById(blockId: string): typeof Block | null {
        for (const id in this.Blocks) {
            if (id === blockId) {
                return this.Blocks[id]
            }
        }
        return null
    }

    /**
     * Get a block class by its numerical ID
     */
    getBlockByNumericalId(numericalId: number): typeof Block | null {
        const blockId = this.getBlockId(numericalId)
        if (blockId !== null) {
            return this.getBlockById(blockId)
        }
        return null
    }



    /**
     * Get a texture by its name from the texture registry
     */
    getTexture(name: string): Texture {
        return this.textures.get(name) || this.textures.get('unknown') as Texture
    }

    /**
     * Registers a texture to the texture registry
     */
    registerTexture(name: string, texture: Texture): void {
        console.log(`Registering texture "${name}"`)
        this.textures.set(name, texture)
    }

    /**
     * Removes a texture from the texture registry
     */
    unregisterTexture(name: string): void {
        if (Engine.RESERVED_TEXTURES.includes(name)) {
            throw new Error(`Cannot unregister reserved texture '${name}'`)
        }
        this.textures.delete(name)
    }



    /**
     * Loads all datapacks from the server
     */
    async loadDatapacks(): Promise<void> {
        const datapacks = await fetch('/api/datapacks').then(res => res.json())
        const initializers: Map<string, DatapackInitializer> = new Map()

        // Load all datapack initializers
        for (const datapack of datapacks) {
            try {
                initializers.set(datapack, await this.loadDatapack(datapack))
            }
            catch (err) {
                console.error(`Failed to load '${datapack}' datapack initializer:`, err)
            }
        }

        // Initialize all datapacks
        for (const [datapack, initializer] of initializers) {
            try {
                initializer.onInitialize()
                await initializer.onInitializeAsync()
            }
            catch (err) {
                console.error(`Failed to initialize '${datapack}' datapack:`, err)
            }
        }

        console.log(`Loaded ${initializers.size} datapacks`)
    }

    /**
     * Loads a datapack from the server
     */
    async loadDatapack(datapack: string): Promise<DatapackInitializer> {
        const info: DatapackInfo = await fetch(`/api/datapack/${datapack}`).then(res => res.json())

        // Register block textures
        for (const textureFile of info.blockTextures) {
            const texturePath = `/game/datapacks/${datapack}/assets/blocks/${textureFile}`
            const textureName = datapack + ':' + textureFile.split('.')[0]

            this.registerTexture(textureName, await WebTexture.Load(texturePath))
        }

        // Return the datapack initializer
        const entrypointImport = await import(`/game/datapacks/${datapack}/${info.manifest.entrypoint}`)
        const initializer = entrypointImport.default

        if (!initializer || !(initializer.prototype instanceof DatapackInitializer)) {
            throw new Error(`Datapack initializer should be an instance of "DatapackInitializer". Received "${initializer}" instead.`)
        }

        return new initializer()
    }
}


export { Engine }
export default new Engine()