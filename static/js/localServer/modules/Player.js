import Entity from './Entity.js'
import CommunicationInterface from './CommunicationInterface.js'
import { validateString } from './dataValidator.js'

export default class Player extends Entity {
    CommunicationInterface = new CommunicationInterface()

    #name = null

    constructor(name = null) {
        super()
        this.name = name
    }

    get name() { return this.#name }

    set name(value) {
        if (value === null) {
            this.#name = value
            return
        }
        
        validateString(value, 'Player name')
        this.#name = value
    }
}