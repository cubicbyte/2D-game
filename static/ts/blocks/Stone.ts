import Block from '../block.js'
import Texture from '../Texture.js'

export default class Stone extends Block {
    public static readonly TEXTURE_URL = '/static/images/stone.jpg'
    public static readonly DEFAULT_TEXTURE = new Texture()

    public static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    public readonly properties: BlockProperties = {
        id: 'main:stone'
    }

    public get texture() { return Stone.DEFAULT_TEXTURE }
}