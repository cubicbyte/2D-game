import Block from '../block.js'
import Texture from '../Texture.js'

export default class IronOre extends Block {
    static readonly TEXTURE_URL = '/static/images/iron_ore.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    readonly properties: BlockProperties = {
        id: 'main:iron_ore'
    }

    get texture() { return IronOre.DEFAULT_TEXTURE }
}