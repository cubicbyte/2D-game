import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Log extends Block {
    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/images/log.jpg')
        delete this.LoadTexture
    }

    get texture() { return Log.#DEFAULT_TEXTURE }
}