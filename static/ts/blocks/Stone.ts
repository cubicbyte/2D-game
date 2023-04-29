import Block from '../block.js'
import Texture from '../Texture.js'

export default class Stone extends Block {
    static readonly TEXTURE_URL = '/static/images/stone.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    readonly properties: BlockProperties = {
        id: 'main:stone'
    }

    get texture() { return Stone.DEFAULT_TEXTURE }
}