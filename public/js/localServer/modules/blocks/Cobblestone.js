import Block from '../Block.js'

export default class Cobblestone extends Block {
    constructor() {
        super({
            properties: {
                name: 'Cobblestone'
            }
        })
    }
}