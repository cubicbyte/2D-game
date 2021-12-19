import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Cobblestone extends Block {
    #properties = {
        hasGravity: false
    }

    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/cobblestone.jpg')
        delete this.LoadTexture
    }

    get texture() { return Cobblestone.texture }
    get properties() { return this.#properties }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
}