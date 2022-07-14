import Block from '../block.js'
import Texture from '../Texture.js'

export default class IronOre extends Block {
    public static readonly TEXTURE_URL = '/public/images/iron_ore.jpg'
    public static readonly DEFAULT_TEXTURE = new Texture()

    public static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    public readonly properties: BlockProperties = {
        id: 'main:iron_ore'
    }

    public get texture() { return IronOre.DEFAULT_TEXTURE }
}