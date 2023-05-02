import { gravity } from './blockUpdateHandlers.js'
import Texture from './Texture.js'
import Engine from './engine.js'
import EventHandler from './utils/eventHandler.js'


export default abstract class Block {
    event = new EventHandler([ 'update' ])
    properties: BlockProperties = {}

    abstract id: string


    constructor() {
        // TODO fix this
        this.event.addEventListener('update', gravity.bind(this))
    }


    get textureName(): string {
        return this.id
    }


    getTexture(): Texture {
        return Engine.getTexture(this.textureName)
    }
}