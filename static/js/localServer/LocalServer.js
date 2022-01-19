import WorldCell from './modules/WorldCell.js'
import Block from './modules/Block.js'
import CommunicationInterface from './modules/CommunicationInterface.js'
import World from './modules/World.js'
import Packet from './modules/Packet.js'
import idGenerator from './modules/idGenerator.js'
import ObjectSet from './modules/ObjectSet.js'

export default class LocalServer {
    CommunicationInterface = new CommunicationInterface()
    Worlds = new ObjectSet(World)

    #mainWorld = null
    #worldIdGenerator = idGenerator()

    constructor() {
        this.Worlds.EventHandler.setEventHandler('add', this.#addWorldHandler.bind(this))
        this.Worlds.EventHandler.addEventListener('add', this.#addWorldListener.bind(this))
        this.Worlds.EventHandler.addEventListener('delete', this.#deleteWorldListener.bind(this))
    }

    #addWorldHandler(world) {
        if (world.registered) {
            throw new Error('The world is already registered')
        }
    }

    #addWorldListener(world) {
        if (!this.#mainWorld) {
            this.#mainWorld = world

            const packet = new Packet('world', {
                type: 'main_world',
                id: world.id
            })

            this.CommunicationInterface.PacketBuffer.add(packet)
        }

        const worldId = this.#worldIdGenerator.next().value
        world.register(worldId)

        const packet = new Packet('world', {
            type: 'new_world',
            id: worldId
        })

        this.CommunicationInterface.PacketBuffer.add(packet)
    }

    #deleteWorldListener(world) {
        if (this.#mainWorld === world) {
            this.#mainWorld = this.Worlds.values().next().value || null

            const packet = new Packet('world', {
                type: 'main_world',
                id: this.#mainWorld && this.#mainWorld.id
            })

            this.CommunicationInterface.PacketBuffer.add(packet)
        }

        const packet = new Packet('world', {
            type: 'world_removed',
            id: world.id
        })

        this.CommunicationInterface.PacketBuffer.add(packet)
        
        world.WorldData.Players.forEach(player => {
            const packet = new Packet('player', {
                type: 'change_world',
                playerName: player.name,
                worldId: this.#mainWorld && this.#mainWorld.id
            })

            this.CommunicationInterface.PacketBuffer.add(packet)
        })
    }
}