import { isFunction, validateInstance, validateObject, validatePositiveInteger } from './dataValidator.js'

export default class World {
    #worldData = class {
        static #width = null
        static #height = null
        static #worldMatrix = null

        static get width() { return this.#width }
        static get height() { return this.#height }
        static get worldMatrix() { return this.#worldMatrix }

        static set width(value) {
            validatePositiveInteger(value, 'World width')
            this.#width = value
        }

        static set height(value) {
            validatePositiveInteger(value, 'World height')
            this.#height = value
        }

        static set worldMatrix(value) {
            if (value === null) {
                this.#worldMatrix = null
                return
            }

            validateInstance(value, Array, 'World matrix')
            this.#worldMatrix = value
        }
    }

    constructor(params = {}) {
        validateObject(params, 'World parameters')

        if (params.size) {
            validateObject(params.size, 'World size')
            validatePositiveInteger(params.size.width, 'World width')
            validatePositiveInteger(params.size.height, 'World height')

            this.#worldData.worldMatrix = new Array
            this.#worldData.width = params.size.width
            this.#worldData.height = params.size.height
        }
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