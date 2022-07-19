import { validateInstance, isPositiveInteger } from './dataValidator.js'
import Block from './Block.js'
import Texture from './Texture.js'

export default class WorldCell {
    static #LIGHT_LEVEL = 0

    #layers = {
        background: null,
        wall: null,
        block: null,
        lightLevel: WorldCell.#LIGHT_LEVEL
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

    update(worldData, x, y) {
        let updateTexture = false

        const { background, wall, block } = this.#layers

        if (background) {
            background.event.getEventListeners('update').forEach(updateFunction => {
                const result = updateFunction('background', worldData, x, y)
                if (result) {
                    updateTexture = true
                }
            })
        }

        if (wall) {
            wall.event.getEventListeners('update').forEach(updateFunction => {
                const result = updateFunction('wall', worldData, x, y)
                if (result) {
                    updateTexture = true
                }
            })
        }

        if (block) {
            block.event.getEventListeners('update').forEach(updateFunction => {
                const result = updateFunction('block', worldData, x, y)
                if (result) {
                    updateTexture = true
                }
            })
        }

        if (updateTexture) {
            return this.#texture.update()
        }
    }

    get texture() { return this.#texture }
    get background() { return this.#layers.background }
    get wall() { return this.#layers.wall }
    get block() { return this.#layers.block }
    get lightLevel() { return 1 - this.#layers.lightLevel }

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

        this.#layers.lightLevel = 1 - value
        this.#texture.update()
    }

    static get LIGHT_LEVEL() { return 1 - this.#LIGHT_LEVEL }
    static set LIGHT_LEVEL(value) {
        if (!Number.isFinite(value) || value < 0 || value > 1) {
            throw new Error(`Light level must be finite number from 0 to 1. Received: ${value}`)
        }

        this.#LIGHT_LEVEL = 1 - value
    }
}