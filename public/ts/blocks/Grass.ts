import random from '../utils/random.js'
import Block from '../block.js'
import Texture from '../Texture.js'
import Dirt from './Dirt.js'
import { DEFAULT_BLOCK_COLOR, DEFAULT_BLOCK_SIZE } from '../constants.js'

export default class Grass extends Block {
    public static readonly DEFAULT_TEXTURE = new Texture({ color: '#117c13' })
        .create(({ ctx, params, setSize }) => {
            if (params.size === undefined) {
                params.size = DEFAULT_BLOCK_SIZE
            }
    
            setSize(params.size)
    
            if (typeof params.color !== 'string') {
                params.color = DEFAULT_BLOCK_COLOR
            }
    
            const pixelColors = [
                '#00b300',
                '#008811',
                '#008800',
                '#009911',
                '#008000'
            ]

            ctx.drawImage(Dirt.DEFAULT_TEXTURE.texture, 0, 0)

            ctx.fillStyle = params.color
            ctx.fillRect(0, 0, params.size, Math.floor(params.size / 4))
    
            for (let i = 0; i < params.size; i++) {
                for (let j = 0; j < params.size / 4; j++) {
                    const randomPixelColorIndex = random(pixelColors.length)
                    const randomPixelColor = pixelColors[randomPixelColorIndex]

                    ctx.fillStyle = randomPixelColor
                    ctx.fillRect(i, j, 1, 1)
                }
            }
        })

    public readonly properties: BlockProperties = {
        id: 'main:grass'
    }
    
    get texture() { return Grass.DEFAULT_TEXTURE }
}