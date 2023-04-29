import Block from '../block.js'
import Texture from '../Texture.js'

export default class Bedrock extends Block {
    static readonly TEXTURE_URL = '/static/images/bedrock.jpg'
    static readonly DEFAULT_TEXTURE = new Texture()

    readonly properties: BlockProperties = {
        id: 'main:bedrock'
    }

    static async LoadTexture?() {
        await this.DEFAULT_TEXTURE.loadFromUrl(this.TEXTURE_URL)
        delete this.LoadTexture
    }

    get texture() { return Bedrock.DEFAULT_TEXTURE }
}