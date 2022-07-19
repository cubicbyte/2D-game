import EventHandler from './Event.js'
import BufferParameters from './BufferParameters.js'

export default class Buffer {
    #event = new EventHandler([ 'update' ])
    #buffer = new Set()
    #parameters

    add(object) {
        this.#buffer.add(object)
    }

    delete(object) {
        return this.#buffer.delete(object)
    }

    constructor(tickRate, eventHandler) {
        this.#parameters = new BufferParameters(tickRate)
        this.#parameters.EventHandler.setEventHandler('update', eventHandler)
    }

    get event() { return this.#event }
    get buffer() { return Array.from(this.#buffer) }
    get parameters() { return this.#parameters }
}