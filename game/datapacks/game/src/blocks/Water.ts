import Block from '/game/js/block.js'
import { liquid } from '/game/js/blockUpdateHandlers.js'

export default class Water extends Block {

    static color = '#4444ee'

    id = 'game:water'


    constructor(level = 1000) {
        super()

        this.properties = {
            hasGravity: true,
            level: level,
            minLevel: 0,
            maxLevel: 1000,
            levelStep: 100
        }

        this.event.addEventListener('update', (e: any) => liquid(this, e))
    }
}