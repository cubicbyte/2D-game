import { validateInstance, validateObject } from './dataValidator.js'
import { gravity } from './blockUpdateHandlers.js'
import EventHandler from './Event.js'
import BlockProperties from './BlockProperties.js'

export default class Block {
    #event = new EventHandler([ 'update' ])
    #properties = new BlockProperties()

    constructor(params = {}) {
        validateObject(params)

        if (params.onupdate) {
            validateInstance(params.onupdate, Array, 'Update listeners')

            params.onupdate.forEach(listener => {
                this.event.addEventListener('update', listener)
            })
        }

        if (params.properties) {
            validateObject(params.properties, 'Block properties')

            for (const property in params.properties) {
                this.properties[property] = params.properties[property]
            }
        }

        this.event.addEventListener('update', gravity.bind(this))
    }

    get event() { return this.#event }
    get properties() { return this.#properties }
}