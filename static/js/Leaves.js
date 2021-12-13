import Block from './Block.js'
import Texture from './Texture.js'

export default class Leaves extends Block {
    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/leaves.jpg')
        delete this.LoadTexture
    }

    get texture() { return Leaves.#DEFAULT_TEXTURE }
}