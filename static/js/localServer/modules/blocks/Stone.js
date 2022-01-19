import Block from '../Block.js'

export default class Stone extends Block {
    constructor() {
        super({
            properties: {
                name: 'Stone'
            }
        })
    }
}