import Block from '../block.js'
import Texture from '../Texture.js'

export default class Log extends Block {
    static readonly TEXTURE_URL = '/static/images/log.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    readonly properties: BlockProperties = {
        id: 'main:log'
    }

    get texture() { return Log.DEFAULT_TEXTURE }
}