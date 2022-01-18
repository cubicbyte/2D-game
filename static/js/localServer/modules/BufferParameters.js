import { validateBoolean, validatePositiveInteger } from './dataValidator.js'
import EventHandler from './Event.js'

export default class BufferParameters {
    #event = new EventHandler([ 'update' ])
    #updatePeriod = null
    #updateInterval = null
    #enabled = false

    constructor(tickRate = 0) {
        validatePositiveInteger(tickRate, 'Tick rate')
        
        this.updatePeriod = 1000 / tickRate
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

        if (this.#updatePeriod === 0) {
            this.#updateInterval = null
            return
        }

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
        if (value === Infinity) {
            value = 0
        }

        validatePositiveInteger(value, 'Update period')
        this.#updatePeriod = value
        this.#updateState()
    }

    set tickRate(value) {
        validatePositiveInteger(value, 'Buffer tick rate')
        this.updatePeriod = 1000 / value
    }

    set enabled(flag) {
        validateBoolean(flag, 'Update state')
        this.#enabled = flag
        this.#updateState()
    }
}