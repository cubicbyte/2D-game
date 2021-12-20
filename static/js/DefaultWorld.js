import { validateObject, isFunction, validateInstance, validatePositiveInteger, validateBoolean, validateWithinMatrix, validateFunction, isWithinMatrix } from './dataValidator.js'
import World from './World.js'
import EventHandler from './Event.js'
import Block from './Block.js'

export default class DefaultWorld extends World {
    static #DEFAULT_WORLD_DATA = class {
        #width = null
        #height = null
        #worldMatrix = null

        #update = new class {
            #parameters = new class {
                static #DEFAULT_UPDATE_PERIOD = 1000/20
                static get DEFAULT_UPDATE_PERIOD() { return this.#DEFAULT_UPDATE_PERIOD }
    
                #event = new EventHandler()
                #updatePeriod = this.constructor.DEFAULT_UPDATE_PERIOD
                #updateInterval = null
                #enabled = false

                constructor() {
                    this.enabled = true
                }

                #updateState() {
                    if (!this.#enabled) {
                        if (this.#updateInterval !== null) {
                            clearInterval(this.#updateInterval)
                        }

                        return
                    }

                    clearInterval(this.#updateInterval)
                    this.#updateInterval = setInterval(this.#update.bind(this), this.#updatePeriod)
                }
                
                #update() {
                    const updateFunction = this.#event.getEventHandler('update')
                    updateFunction()
                }

                get event() { return this.#event }
                get updatePeriod() { return this.#updatePeriod }
                get enabled() { return this.#enabled }

                set updatePeriod(value) {
                    validatePositiveInteger(value, 'Update period')
                    this.#updatePeriod = value
                    this.#updateState()
                }

                set enabled(flag) {
                    validateBoolean(flag, 'Update state')
                    this.#enabled = flag
                    this.#updateState()
                }
            }
            
            #updateBuffer = new Set()

            addToBuffer(object) {
                validateObject(object, 'Object')
                validateFunction(object.callback, 'Update function')
                this.#updateBuffer.add(object)
            }

            #update() {
                const buffer = Array.from(this.#updateBuffer)
                buffer.forEach(object => {
                    this.#updateBuffer.delete(object)
                    object.callback()
                })
            }

            constructor() {
                this.#parameters.event.setEventHandler('update', this.#update.bind(this))
            }

            get updateBuffer() { return Array.from(this.#updateBuffer) }
            get parameters() { return this.#parameters }
        }

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
            const registeredPositions = this.#update.updateBuffer.map(object => object.key)

            if (registeredPositions.includes(key) || !cell) {
                return false
            }

            this.#update.addToBuffer({
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
            cell.texture.update()

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

            oldCell.texture.update()
            newCell.texture.update()

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

        setup(params = {}) {
            validateObject(params, 'World data parameters')

            if (params.size) {
                validateObject(params.size, 'World size')
                validatePositiveInteger(params.size.width, 'World width')
                validatePositiveInteger(params.size.height, 'World height')
    
                this.worldMatrix = []
                this.width = params.size.width
                this.height = params.size.height
            }

            delete this.setup
        }
    }

    #worldData = new DefaultWorld.#DEFAULT_WORLD_DATA

    constructor(params = {}) {
        super(params)
        this.worldData.setup(params.parameters)
    }
    
    async generateWorld(generator) {
        const worldMatrix = await generator(this.#worldData.width, this.#worldData.height)
        this.#worldData.worldMatrix = worldMatrix
    }

    async updateTextures(params = {}) {
        validateObject(params, 'Parameters')

        if (!isFunction(params.onprogress)) {
            params.onprogress = function() {}
        }

        for (let i = 0; i < this.#worldData.width; i++) {
            for (let j = 0; j < this.#worldData.height; j++) {
                this.#worldData.worldMatrix[i][j].texture.update()
            }

            await params.onprogress((i + 1) / this.#worldData.width)
        }
    }

    get worldData() { return this.#worldData }
}