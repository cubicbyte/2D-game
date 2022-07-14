import Block from './block.js'
import Texture from './Texture.js'
import { DEFAULT_BLOCK_SIZE } from './constants.js'

export default class WorldCell {
    private static _lightLevel = 0

    private _layers: WorldCellLayers = {
        background: null,
        wall: null,
        block: null,
        lightLevel: WorldCell._lightLevel
    }

    private _texture = new Texture().create(({ ctx, canvas, params, setSize }) => {
        if (params.size === undefined) {
            params.size = DEFAULT_BLOCK_SIZE
        }

        if (params.size !== canvas.width) {
            if (canvas.width === canvas.height) {
                if (this._layers.background) {
                    this._layers.background.texture.update(params)
                }
                
                if (this._layers.wall) {
                    this._layers.wall.texture.update(params)
                }

                if (this._layers.block) {
                    this._layers.block.texture.update(params)
                }
            }

            setSize(params.size)
        }

        if (this._layers.background) {
            ctx.drawImage(this._layers.background.texture.texture, 0, 0)
        }

        if (this._layers.wall) {
            ctx.drawImage(this._layers.wall.texture.texture, 0, 0)
            
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        if (this._layers.block) {
            ctx.drawImage(this._layers.block.texture.texture, 0, 0)
        }

        ctx.fillStyle = `rgba(0,0,0,${this._layers.lightLevel})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    })

    public async update(params: BlockUpdateParameters) {
        if (!this._layers.block) {
            return
        }

        let updateTexture = false
        
        this._layers.block.event.getEventListeners('update').forEach(updateFunction => {
            const result = updateFunction(params)

            if (result) {
                updateTexture = true
            }
        })

        if (updateTexture) {
            await this._texture.update()
        }
    }

    get texture() { return this._texture }
    get background() { return this._layers.background }
    get wall() { return this._layers.wall }
    get block() { return this._layers.block }
    get lightLevel() { return 1 - this._layers.lightLevel }

    set background(block: Block | null) {
        this._layers.background = block
    }

    set wall(block: Block | null) {
        this._layers.wall = block
    }

    set block(block: Block | null) {
        this._layers.block = block
    }

    set lightLevel(value: number) {
        if (value < 0 || value > 1) {
            throw new Error(`Light level must be float number between 0 and 1. Received: ${value}`)
        }

        this._layers.lightLevel = 1 - value
        this._texture.update()
    }

    static get lightLevel() { return 1 - this._lightLevel }
    static set lightLevel(value: number) {
        if (value < 0 || value > 1) {
            throw new Error(`Light level must be float number between 0 and 1. Received: ${value}`)
        }

        this._lightLevel = 1 - value
    }
}