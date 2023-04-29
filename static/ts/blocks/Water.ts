import Block from '../block.js'
import { liquid } from '../blockUpdateHandlers.js'
import { DEFAULT_BLOCK_SIZE } from '../constants.js'
import Texture from '../Texture.js'

export default class Water extends Block {
    properties: BlockProperties
    static readonly DEFAULT_TEXTURE = new Texture({ color: '#4444ee' }).create(function({ params, setSize, setBackground }) {
        if (params.size === undefined) {
            params.size = DEFAULT_BLOCK_SIZE
        }

        setSize(params.size)
        setBackground(params.color)
    })

    get texture(): Texture {
        return Water.DEFAULT_TEXTURE
    }
    
    constructor(level = 1000) {
        super()

        this.properties = {
            id: 'main:water',
            hasGravity: true,
            level: level,
            minLevel: 0,
            maxLevel: 1000,
            levelStep: 100
        }

        this.event.addEventListener('update', liquid.bind(this))
    }
}