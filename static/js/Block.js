import convertObject from './convertObject.js'
import { validateInstance, validateObject, validateIntegerRange, validatePositiveInteger, validateBoolean } from './dataValidator.js'
import EventHandler from './Event.js'

export default class Block {
    #event = new EventHandler()
    
    #updateGravity(type, worldData, x, y) {
        if (type !== 'block' || !this.properties.hasGravity || y + 1 >= worldData.height) {
            return false
        }
    
        if (!worldData.worldMatrix[x][y + 1].block) {
            if (!this.properties.falling) {
                this.properties.falling = true
                worldData.updateNearestBlocks(x, y)
            }
            
            if (y + 2 < worldData.height && worldData.worldMatrix[x][y + 2].block) {
                this.properties.falling = false
                worldData.updateNearestBlocks(x, y + 2)
            }

            worldData.moveBlock(x, y, x, y + 1)
        }
    }

    #properties = convertObject({
        __minLevel: 0,
        __maxLevel: 0,
        __levelStep: 0,
        __hasGravity: false,
        __falling: false,
        __level: 0,
        _hasGravity(flag) {
            validateBoolean(flag)
            return flag
        },
        _falling(flag) {
            validateBoolean(flag)
            return flag
        },
        _level(value) {
            value -= value % this.levelStep
            validateIntegerRange(value, this.minLevel, this.maxLevel, 'Water level')
            return value
        },
        _minLevel(value) {
            validatePositiveInteger(value)
            if (value > this.maxLevel) {
                throw new Error('The minimum level can not exceed the maximum')
            }
            return value
        },
        _maxLevel(value) {
            validateIntegerRange(value, this.minLevel, Infinity, 'Maximum level')
            return value
        },
        _levelStep(value) {
            validatePositiveInteger(value, 'Level step')
            return value
        }
    })

    constructor(params = {}) {
        validateObject(params)

        if (params.onupdate) {
            validateInstance(params.onupdate, Array, 'Update listeners')

            params.onupdate.forEach(listener => {
                this.event.addEventListener('update', listener.bind(this))
            })
        }

        if (params.properties) {
            validateObject(params.properties, 'Block properties')

            for (const property in params.properties) {
                this.properties[property] = params.properties[property]
            }
        }

        this.event.addEventListener('update', this.#updateGravity.bind(this))
    }

    get event() { return this.#event }
    get properties() { return this.#properties }
}