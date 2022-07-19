import EventHandler from './Event.js'
import Packet from './Packet.js'
import PacketBuffer from './PacketBuffer.js'
import State from './State.js'

export default class CommunicationInterface {
    PacketBuffer = new PacketBuffer(
        1,
        state => this.EventHandler
            .getEventListeners('outcoming-state')
            .forEach(listener => listener(state))
    )

    EventHandler = new EventHandler(['outcoming-state', 'incoming-state'])

    handleIncomingState(state) {
        const isStateValid = State.Validate(state)

        if (!isStateValid) {
            return false
        }

        for (const key in state) {
            const packet = new Packet(key, state[key])
            this.PacketBuffer.add(packet)
        }
    }
}