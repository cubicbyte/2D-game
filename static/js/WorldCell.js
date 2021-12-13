import { validateInstance, validateFinite, isPositiveInteger } from './dataValidator.js'
import Block from './Block.js'
import Texture from './Texture.js'

export default class WorldCell {
    #layers = {
        background: null,
        wall: null,
        block: null,
        lightLevel: 0
    }

    #texture = new Texture().create((ctx, canvas, params) => {
        if (!isPositiveInteger(params.size)) {
            params.size = 16
        }

        if (params.size !== canvas.width) {
            if (canvas.width === canvas.height) {
                if (this.#layers.background) {
                    this.#layers.background.texture.update(params)
                }
                
                if (this.#layers.wall) {
                    this.#layers.wall.texture.update(params)
                }

                if (this.#layers.block) {
                    this.#layers.block.texture.update(params)
                }
            }

            canvas.width = params.size
            canvas.height = params.size
        }

        if (this.#layers.background) {
            ctx.drawImage(this.#layers.background.texture.texture, 0, 0)
        }

        if (this.#layers.wall) {
            ctx.drawImage(this.#layers.wall.texture.texture, 0, 0)
            
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        if (this.#layers.block) {
            ctx.drawImage(this.#layers.block.texture.texture, 0, 0)
        }

        ctx.fillStyle = `rgba(0,0,0,${this.#layers.lightLevel})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    })

    constructor() {

    }

    get texture() { return this.#texture }
    get background() { return this.#layers.background }
    get wall() { return this.#layers.wall }
    get block() { return this.#layers.block }
    get lightLevel() { return this.#layers.lightLevel }

    set background(block) {
        if (block !== null) {
            validateInstance(block, Block, 'Background')
        }
        this.#layers.background = block
    }

    set wall(block) {
        if (block !== null) {
            validateInstance(block, Block, 'Wall')
        }
        this.#layers.wall = block
    }

    set block(block) {
        if (block !== null) {
            validateInstance(block, Block, 'Block')
        }
        this.#layers.block = block
    }

    set lightLevel(value) {
        if (!Number.isFinite(value) || value < 0 || value > 1) {
            throw new Error(`Light level must be finite number from 0 to 1. Received: ${value}`)
        }

        this.#layers.lightLevel = -value
        this.#texture.update()
    }
}