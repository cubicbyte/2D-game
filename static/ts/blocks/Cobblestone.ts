import Block from '../block.js'
import Texture from '../Texture.js'

export default class Cobblestone extends Block {
    static readonly TEXTURE_URL = '/static/images/cobblestone.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    readonly properties: BlockProperties = {
        id: 'main:cobblestone'
    }

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    get texture() { return Cobblestone.DEFAULT_TEXTURE }
}