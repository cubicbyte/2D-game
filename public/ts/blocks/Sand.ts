import Block from '../block.js'
import Texture from '../Texture.js'

export default class Sand extends Block {
    public static readonly TEXTURE_URL = '/public/images/sand.jpg'
    public static readonly DEFAULT_TEXTURE = new Texture()

    public readonly properties: BlockProperties = {
        id: 'main:sand',
        hasGravity: true
    }

    public static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    public get texture() { return Sand.DEFAULT_TEXTURE }
}