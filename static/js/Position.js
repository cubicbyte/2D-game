import { validateInteger } from './dataValidator.js'

export default class Position {
    #x = 0
    #y = 0

    moveTo(x, y) {
        this.x = x
        this.y = y
    }

    moveBy(x, y) {
        this.x += x
        this.y += y
    }

    set(position) {
        validateObject(position, 'Position')
        this.moveTo(position.x, position.y)
    }

    get x() { return this.#x }
    get y() { return this.#y }

    set x(value) {
        validateInteger(value, 'X position')
        this.#x = value
    }

    set y(value) {
        validateInteger(value, 'Y position')
        this.#y = value
    }
}