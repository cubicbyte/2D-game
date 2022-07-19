import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Sand extends Block {
    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/sand.jpg')
        delete this.LoadTexture
    }

    constructor() {
        super({
            properties: {
                hasGravity: true
            }
        })
    }

    get texture() { return Sand.texture }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
}