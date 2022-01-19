import Block from './Block.js'
import { validatePositiveInteger, validateWithinMatrix, validateInstance, isWithinMatrix } from './dataValidator.js'
import UpdateBuffer from './UpdateBuffer.js'
import Player from './Player.js'
import ObjectSet from './ObjectSet.js'

export default class WorldData {
    #width = null
    #height = null
    #worldMatrix = null
    #update = new UpdateBuffer(20)

    Players = new ObjectSet(Player)

    #updateNearestBlocks(x, y) {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!isWithinMatrix(this.#worldMatrix, i, j)) {
                    continue
                }

                this.#updateCell(i, j)
            }
        }
    }

    updateNearestBlocks(x, y) {
        validatePositiveInteger(x, 'Cell X position')
        validatePositiveInteger(y, 'Cell Y position')
        validateWithinMatrix(this.#worldMatrix, x, y, 'World matrix')
        this.#updateNearestBlocks(x, y)
    }

    #updateCell(x, y) {
        const cell = this.#worldMatrix[x][y]
        const key = `pos:${x}.${y}`
        const registeredPositions = this.#update.buffer.map(object => object.key)

        if (registeredPositions.includes(key) || !cell) {
            return false
        }

        this.#update.add({
            key,
            callback: () => cell.update(this, x, y)
        })
    }

    updateCell(x, y) {
        validatePositiveInteger(x, 'Cell X position')
        validatePositiveInteger(y, 'Cell Y position')
        validateWithinMatrix(this.#worldMatrix, x, y, 'World matrix')

        this.#updateCell(x, y)
    }

    #placeBlock(x, y, block) {
        const cell = this.#worldMatrix[x][y]
        cell.block = block
        this.#updateNearestBlocks(x, y)
    }

    placeBlock(x, y, block) {
        validatePositiveInteger(x, 'Cell X position')
        validatePositiveInteger(y, 'Cell Y position')
        validateWithinMatrix(this.#worldMatrix, x, y, 'World matrix')

        if (block !== null) {
            validateInstance(block, Block, 'Block')
        }

        this.#placeBlock(x, y, block)
    }

    #removeBlock(x, y) {
        this.#worldMatrix[x][y].block = null
        this.#updateNearestBlocks(x, y)
    }

    removeBlock(x, y) {
        validatePositiveInteger(x, 'Cell X position')
        validatePositiveInteger(y, 'Cell Y position')
        validateWithinMatrix(this.#worldMatrix, x, y, 'World matrix')
        this.#removeBlock(x, y)
    }

    #moveBlock(x1, y1, x2, y2) {
        const oldCell = this.#worldMatrix[x1][y1]
        const newCell = this.#worldMatrix[x2][y2]

        newCell.block = oldCell.block
        oldCell.block = null

        this.#updateCell(x1, y1 - 1)
        this.#updateCell(x2, y2)
    }

    moveBlock(x1, y1, x2, y2, noUpdate = false) {
        validatePositiveInteger(x1, 'Old cell X position')
        validatePositiveInteger(y1, 'Old cell Y position')
        validatePositiveInteger(x2, 'New cell X position')
        validatePositiveInteger(y2, 'New cell Y position')
        validateWithinMatrix(this.#worldMatrix, x1, y1, 'World matrix')
        validateWithinMatrix(this.#worldMatrix, x2, y2, 'World matrix')
        this.#moveBlock(x1, y1, x2, y2, noUpdate)
    }

    get update() { return this.#update }
    get width() { return this.#width }
    get height() { return this.#height }
    get worldMatrix() { return this.#worldMatrix }

    set width(value) {
        validatePositiveInteger(value, 'World width')
        this.#width = value
    }

    set height(value) {
        validatePositiveInteger(value, 'World height')
        this.#height = value
    }

    set worldMatrix(value) {
        if (value === null) {
            this.#worldMatrix = null
            return
        }

        validateInstance(value, Array, 'World matrix')
        this.#worldMatrix = value
    }
}