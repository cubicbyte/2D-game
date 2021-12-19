import EventHandler from './Event.js'

export default class Block {
    #event = new EventHandler()
    
    #updateGravity(type, worldData, x, y) {
        if (type !== 'block' || !this.properties.hasGravity || y + 1 >= worldData.height) {
            return false
        }
    
        if (!worldData.worldMatrix[x][y + 1].block) {
            if (worldData.worldMatrix[x][y + 1].block) {
                worldData.updateNearestBlocks(x, y + 1)
            }

            worldData.moveBlock(x, y, x, y + 1)
        }
    }

    constructor(eventListeners = []) {
        eventListeners.forEach(listener => {
            this.event.addEventListener('update', listener.bind(this))
        })

        this.event.addEventListener('update', this.#updateGravity.bind(this))
    }

    get event() { return this.#event }
}