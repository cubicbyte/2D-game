import Block from '../block.js'
import Texture from '../Texture.js'

export default class Log extends Block {
    public static readonly TEXTURE_URL = '/public/images/log.jpg'
    public static readonly DEFAULT_TEXTURE = new Texture()

    public static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    public readonly properties: BlockProperties = {
        id: 'main:log'
    }

    public get texture() { return Log.DEFAULT_TEXTURE }
}