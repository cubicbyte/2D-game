import Block from '../block.js'
import Texture from '../Texture.js'

export default class Cobblestone extends Block {
    public static readonly TEXTURE_URL = '/static/images/cobblestone.jpg'
    public static readonly DEFAULT_TEXTURE = new Texture()

    public readonly properties: BlockProperties = {
        id: 'main:cobblestone'
    }

    public static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    public get texture() { return Cobblestone.DEFAULT_TEXTURE }
}