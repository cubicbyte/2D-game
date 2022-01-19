import { validateInstance } from './dataValidator.js'
import Block from './Block.js'

export default class WorldCell {
    #layers = {
        background: null,
        wall: null,
        block: null
    }

    update(worldData, x, y) {
        const { background, wall, block } = this.#layers

        if (background) {
            background.event.getEventListeners('update').forEach(
                updateFunction => updateFunction('background', worldData, x, y)
            )
        }

        if (wall) {
            wall.event.getEventListeners('update').forEach(
                updateFunction => updateFunction('wall', worldData, x, y)
            )
        }

        if (block) {
            block.event.getEventListeners('update').forEach(
                updateFunction => updateFunction('block', worldData, x, y)
            )
        }
    }

    get background() { return this.#layers.background }
    get wall() { return this.#layers.wall }
    get block() { return this.#layers.block }

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
}