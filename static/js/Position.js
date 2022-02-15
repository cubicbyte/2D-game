import { validateFinite } from './dataValidator.js'

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

    #parsePosition(value) {
        validateFinite(value, 'Position')

        value = parseInt(value)
        return value
    }

    get x() { return this.#x }
    get y() { return this.#y }

    set x(value) {
        const oldValue = value

        value = this.#parsePosition(value)

        if (value === this.#x && value !== oldValue) {

            value += oldValue < 0 ? -1 : 1

        }

        this.#x = value
    }

    set y(value) {
        const oldValue = value

        value = this.#parsePosition(value)

        if (value === this.#y && value !== oldValue) {

            value += oldValue < 0 ? -1 : 1
            
        }

        this.#y = value
    }
}