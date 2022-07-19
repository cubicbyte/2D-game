import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Log extends Block {
    static #DEFAULT_TEXTURE = new Texture()
    static async LoadTexture() {
        await this.#DEFAULT_TEXTURE.loadFromUrl('/public/images/log.jpg')
        delete this.LoadTexture
    }

    get texture() { return Log.texture }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
}