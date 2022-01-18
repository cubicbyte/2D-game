import Buffer from './Buffer.js'
import State from './State.js'

export default class PacketBuffer extends Buffer {
    #callback

    constructor(tickRate, callback) {
        const update = () => {
            const state = new State()
        
            for (const packet of this.buffer) {
                switch (packet.type) {
                    case 'chat':
                        state.chat.push(packet.data)
                        break
                }

                this.delete(packet)
            }

            this.#callback(state)
        }
        
        super(tickRate, update)
        this.#callback = callback
    }
}