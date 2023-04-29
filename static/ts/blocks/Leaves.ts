import Block from '../block.js'
import Texture from '../Texture.js'

export default class Leaves extends Block {
    static readonly TEXTURE_URL = '/static/images/leaves.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    readonly properties: BlockProperties = {
        id: 'main:leaves'
    }

    get texture() { return Leaves.DEFAULT_TEXTURE }
}