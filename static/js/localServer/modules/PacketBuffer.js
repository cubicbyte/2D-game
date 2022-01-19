import Buffer from './Buffer.js'
import State from './State.js'

export default class PacketBuffer extends Buffer {
    #callback

    constructor(tickRate, callback) {
        const update = () => {
            const state = new State()
        
            for (const packet of this.buffer) {
                state[packet.type].push(packet.data)
                this.delete(packet)
            }

            this.#callback(state)
        }
        
        super(tickRate, update)
        this.#callback = callback
    }
}