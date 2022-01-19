import Block from '../Block.js'
import { liquid } from '../blockUpdateHandlers.js'

export default class Water extends Block {
    constructor(level = 1000) {
        super({
            properties: {
                name: 'Water',
                hasGravity: true,
                level,
                minLevel: 0,
                maxLevel: 1000,
                levelStep: 100
            }
        })

        this.event.addEventListener('update', liquid.bind(this))
    }
}