import random from '../utils/random.js'
import Block from '../block.js'
import Texture from '../Texture.js'
import { DEFAULT_BLOCK_COLOR, DEFAULT_BLOCK_SIZE } from '../constants.js'

export default class Dirt extends Block {
    static readonly DEFAULT_TEXTURE = new Texture({ color: '#734f2b' })
        .create(({ ctx, params, setSize, setBackground }) => {
            if (params.size === undefined) {
                params.size = DEFAULT_BLOCK_SIZE
            }
    
            setSize(params.size)
    
            if (typeof params.color !== 'string') {
                params.color = DEFAULT_BLOCK_COLOR
            }
    
            setBackground(params.color)
    
            function fillRandomPixel(color: string) {
                ctx.fillStyle = color
                ctx.fillRect(
                    random(params.size),
                    random(params.size),
                    1,
                    1
                )
            }
    
            for (let i = 0; i < params.size * 6; i++) {
                fillRandomPixel('#593d21')
            }
    
            for (let i = 0; i < params.size * 4; i++) {
                fillRandomPixel('#47301a')
            }
    
            for (let i = 0; i < params.size * 2; i++) {
                fillRandomPixel('#7e5530')
            }
    
            for (let i = 0; i < params.size / 4; i++) {
                fillRandomPixel('#646973')
            }
        })

    readonly properties: BlockProperties = {
        id: 'main:dirt'
    }
    
    get texture() { return Dirt.DEFAULT_TEXTURE }
}