import EventHandler from './Event.js'
import Packet from './Packet.js'
import PacketBuffer from './PacketBuffer.js'

export default class CommunicationInterface {
    PacketBuffer = new PacketBuffer(
        1,
        state => this.EventHandler
            .getEventListeners('state')
            .forEach(listener => listener(state))
    )

    EventHandler = new EventHandler([ 'state' ])

    handleIncomingState(state) {
        for (const message of state.chat) {
            const packet = new Packet('chat', message)
            this.PacketBuffer.add(packet)
        }
    }
}