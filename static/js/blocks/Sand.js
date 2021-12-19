import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Sand extends Block {
    #properties = {
        hasGravity: true
    }

    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/sand.jpg')
        delete this.LoadTexture
    }

    get texture() { return Sand.texture }
    get properties() { return this.#properties }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
}