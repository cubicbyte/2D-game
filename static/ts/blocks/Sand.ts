import Block from '../block.js'
import Texture from '../Texture.js'

export default class Sand extends Block {
    static readonly TEXTURE_URL = '/static/images/sand.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    readonly properties: BlockProperties = {
        id: 'main:sand',
        hasGravity: true
    }

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    get texture() { return Sand.DEFAULT_TEXTURE }
}