import Block from '../block.js'
import { DEFAULT_BLOCK_COLOR, DEFAULT_BLOCK_SIZE } from '../constants.js'
import Texture from '../Texture.js'

export default class Air extends Block {
    private static readonly _TextureGenerator: TextureGenerator = ({ setSize, setBackground, params }) => {
        if (params.size === undefined) {
            params.size = DEFAULT_BLOCK_SIZE
        }

        setSize(params.size)

        if (typeof params.color !== 'string') {
            params.color = DEFAULT_BLOCK_COLOR
        }

        setBackground(params.color)
    }

    public readonly properties: BlockProperties = {
        id: 'main:air'
    }

    public static readonly DEFAULT_TEXTURE = new Texture({ color: '#87CEEB' }).create(this._TextureGenerator)

    get texture() { return Air.DEFAULT_TEXTURE }
}