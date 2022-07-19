import Block from '../Block.js'

export default class Air extends Block {
    constructor() {
        super({
            properties: {
                name: 'Air'
            }
        })
    }
}