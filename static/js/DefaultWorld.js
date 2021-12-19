import { validateObject, isFunction, validateInstance, validatePositiveInteger } from './dataValidator.js'
import World from './World.js'

export default class DefaultWorld extends World {
    static #DEFAULT_WORLD_DATA = class {
        #width = null
        #height = null
        #worldMatrix = null

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