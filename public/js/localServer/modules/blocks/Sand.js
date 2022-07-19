import Block from '../Block.js'

export default class Sand extends Block {
    constructor() {
        super({
            properties: {
                name: 'Sand',
                hasGravity: true
            }
        })
    }
}