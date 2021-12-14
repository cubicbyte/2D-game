import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Cobblestone extends Block {
    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/cobblestone.jpg')
        delete this.LoadTexture
    }

    get texture() { return Cobblestone.#DEFAULT_TEXTURE }
}