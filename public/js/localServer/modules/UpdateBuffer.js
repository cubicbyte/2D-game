import Buffer from './Buffer.js'

export default class UpdateBuffer extends Buffer {
    constructor(tickRate) {
        const update = () => {
            for (const object of this.buffer) {
                this.delete(object)
                object.callback()
            }
        }
        
        super(tickRate, update)
    }
}