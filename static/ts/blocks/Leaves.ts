import Block from '../block.js'
import Texture from '../Texture.js'

export default class Leaves extends Block {
    public static readonly TEXTURE_URL = '/static/images/leaves.jpg'
    public static readonly DEFAULT_TEXTURE = new Texture()

    public static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    public readonly properties: BlockProperties = {
        id: 'main:leaves'
    }

    public get texture() { return Leaves.DEFAULT_TEXTURE }
}