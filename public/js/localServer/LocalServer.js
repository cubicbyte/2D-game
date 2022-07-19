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
        if (world.Registration.status) {
            throw new Error('The world is already registered')
        }
    }

    #addWorldListener(world) {
        function cellUpdateHandler(x, y) {
            const packet = new Packet('world', {
                type: 'cell_update',
                x,
                y,
                cell: world.WorldData.worldMatrix[x][y]
            })
            
            this.CommunicationInterface.PacketBuffer.add(packet)
        }

        const worldId = this.#worldIdGenerator.next().value
        
        world.Registration.register({
            id: worldId,
            cellUpdateHandler: cellUpdateHandler.bind(this)
        })

        world.WorldData.EventHandler.addEventListener('cell_update', world.Registration.data.cellUpdateHandler)

        if (!this.#mainWorld) {
            this.#mainWorld = world

            const packet = new Packet('world', {
                type: 'main_world_change',
                id: world.Registration.data.id
            })

            this.CommunicationInterface.PacketBuffer.add(packet)
        }

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
                id: this.#mainWorld && this.#mainWorld.Registration.data.id
            })

            this.CommunicationInterface.PacketBuffer.add(packet)
        }

        const packet = new Packet('world', {
            type: 'world_removed',
            id: world.Registration.data.id
        })

        this.CommunicationInterface.PacketBuffer.add(packet)

        world.WorldData.EventHandler.removeEventListener('cell_update', world.Registration.data.cellUpdateHandler)
        world.WorldData.Players.forEach(player => {
            const packet = new Packet('player', {
                type: 'change_world',
                playerName: player.name,
                worldId: this.#mainWorld && this.#mainWorld.Registration.data.id
            })

            this.CommunicationInterface.PacketBuffer.add(packet)
        })
    }
}

import Sand from './modules/blocks/Sand.js'
import { defaultWorld } from './modules/worldGenerators.js'

window.LocalServer = LocalServer
window.server = new LocalServer()
server.CommunicationInterface.EventHandler.addEventListener('outcoming-state', console.log)

const WORLD_WIDTH = 48
const WORLD_HEIGHT = 32

const sworld = new World()
const generator = defaultWorld()

sworld.WorldData.width = WORLD_WIDTH
sworld.WorldData.height = WORLD_HEIGHT
sworld.WorldData.worldMatrix = await generator(WORLD_WIDTH, WORLD_HEIGHT)

window.sworld = sworld
server.Worlds.add(sworld)
sworld.WorldData.placeBlock(2, 2, new Sand())