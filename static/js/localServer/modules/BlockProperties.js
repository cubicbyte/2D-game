import { validateBoolean, validateIntegerRange, validatePositiveInteger, validateString } from './dataValidator.js'

export default class BlockProperties {
    #blockName = null
    #level = 0
    #minLevel = 0
    #maxLevel = 0
    #levelStep = 0
    #hasGravity = false
    #falling = false

    get blockName() { return this.#blockName }
    get level() { return this.#level }
    get minLevel() { return this.#minLevel }
    get maxLevel() { return this.#maxLevel }
    get levelStep() { return this.#levelStep }
    get hasGravity() { return this.#hasGravity }
    get falling() { return this.#falling }

    set blockName(value) {
        validateString(value, 'Block name')
        this.#blockName = value
    }

    set level(value) {
        value -= value % this.levelStep
        validateIntegerRange(value, this.minLevel, this.maxLevel, 'Water level')
        this.#level = value
    }

    set minLevel(value) {
        validatePositiveInteger(value)
        if (value > this.maxLevel) {
            throw new Error('The minimum level can not exceed the maximum')
        }
        this.#minLevel = value
    }

    set maxLevel(value) {
        validateIntegerRange(value, this.minLevel, Infinity, 'Maximum level')
        this.#maxLevel = value
    }

    set levelStep(value) {
        validatePositiveInteger(value, 'Level step')
        this.#levelStep = value
    }

    set hasGravity(flag) {
        validateBoolean(flag)
        this.#hasGravity = flag
    }

    set falling(flag) {
        validateBoolean(flag)
        this.#falling = flag
    }
}