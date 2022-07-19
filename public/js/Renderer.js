import { isFunction, validateFunction, validateInstance, validateObject } from './dataValidator.js'

export default class Renderer {
    #canvas = document.createElement('canvas')
    #ctx = this.#canvas.getContext('2d')
    #renderingFunction = null

    constructor(params = {}) {
        if (isFunction(params)) {
            params = {
                renderingFunction: params
            }
        }
        validateObject(params, 'Renderer parameters')

        if (params.renderingFunction) {
            this.renderingFunction = params.renderingFunction
        }
    }

    render() {
        this.#renderingFunction(this.#ctx, this.#canvas)
    }

    get canvas() { return this.#canvas }
    get ctx() { return this.#ctx }
    get renderingFunction() { return this.#renderingFunction }

    set canvas(element) {
        validateInstance(element, HTMLCanvasElement, 'Renderer canvas')
        this.#canvas = element
        this.#ctx = element.getContext('2d')
    }

    set renderingFunction(renderingFunction) {
        validateFunction(renderingFunction, 'Rendering function')
        this.#renderingFunction = renderingFunction
    }
}