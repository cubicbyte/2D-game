import Block from '../Block.js'
import Texture from '../Texture.js'

export default class IronOre extends Block {
    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/iron_ore.jpg')
        delete this.LoadTexture
    }

    get texture() { return IronOre.texture }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
}