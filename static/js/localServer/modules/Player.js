import Entity from './Entity.js'
import { validateString } from './dataValidator.js'

export default class Player extends Entity {
    #name = null

    constructor(name = null) {
        super()
        this.name = name
    }

    get name() { return this.#name }

    set name(value) {
        if (value !== null) {
            validateString(value, 'Player name')
        }
        
        this.#name = value
    }
}