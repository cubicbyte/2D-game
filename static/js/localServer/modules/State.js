export default class State {
    static Validate(state) {
        if (
            !state
            || typeof state !== 'object'
            || !Array.isArray(state.chat)
            || !Array.isArray(state.world)
            || !Array.isArray(state.player)
        ) {
            return false
        }

        for (const message of state.chat) {
            if (
                typeof message !== 'object'
                || typeof message.sender !== 'string'
                || typeof message.text !== 'string'
            ) {
                return false
            }
        }
        
        for (const packet of state.world) {
            if (
                typeof packet !== 'object'
                || typeof packet.type !== 'string'
            ) {
                return false
            }
        }

        for (const packet of state.player) {
            if (
                typeof packet !== 'object'
                || typeof packet.type !== 'string'
            ) {
                return false
            }
        }
    }

    chat = []
    world = []
    player = []
}

export class Message {
    constructor(sender, text) {
        this.sender = sender
        this.text = text
    }
}