import Block from '../Block.js'

export default class Log extends Block {
    constructor() {
        super({
            properties: {
                name: 'Log'
            }
        })
    }
}