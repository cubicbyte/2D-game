import Block from '../block.js'
import { liquid } from '../blockUpdateHandlers.js'
import { DEFAULT_BLOCK_SIZE } from '../constants.js'
import Texture from '../Texture.js'

export default class Water extends Block {
    public static readonly DEFAULT_WATER_LEVEL = 800
    public texture = new Texture({ color: '#4444ee' })

    public properties: BlockProperties = {
        id: 'main:water',
        //hasGravity: true,
        minLevel: 0,
        maxLevel: 1000,
        levelStep: 100
    }

    private _textureGenerator = ({ params, ctx, setSize }: TextureGeneratorParameters) => {
        if (params.size === undefined) {
            params.size = DEFAULT_BLOCK_SIZE
        }
        
        setSize(params.size)

        /*const levelK = Math.floor(params.size * (this.properties.level || 0 / (this.properties.maxLevel || 1)))
        console.log(levelK)

        ctx.fillStyle = params.color
        ctx.fillRect(0, params.size - levelK, params.size, levelK)*/

        ctx.fillStyle = params.color
        ctx.fillRect(0, 0, params.size, params.size)
    }

    constructor(level = Water.DEFAULT_WATER_LEVEL) {
        super()

        this.properties.level = level
        this.texture.create(this._textureGenerator)
        this.event.addEventListener('update', liquid.bind(this))
    }
}