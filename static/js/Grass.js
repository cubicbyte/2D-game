import { isPositiveInteger } from './dataValidator.js'
import random from './random.js'
import Block from './Block.js'
import Texture from './Texture.js'
import Dirt from './Dirt.js'

export default class Grass extends Block {
    static #DEFAULT_TEXTURE = new Texture().create(function(ctx, canvas, params) {
        if (!isPositiveInteger(params.size)) {
            params.size = 16
        }

        const grassPixelColors = [
            '#00b300',
            '#008811',
            '#008800',
            '#009911',
            '#008000'
        ]

        this.setSize(params.size)

        const dirt = new Dirt()
        ctx.drawImage(dirt.texture.texture, 0, 0)
        ctx.fillStyle = '#117c13'
        ctx.fillRect(0, 0, params.size, Math.floor(params.size / 4))

        for (let i = 0; i < params.size; i++) {
            for (let j = 0; j < params.size / 4; j++) {
                const randomGrassPixelColor = grassPixelColors[random(grassPixelColors.length)]
                ctx.fillStyle = randomGrassPixelColor
                ctx.fillRect(i, j, 1, 1)
            }
        }
    })

    get texture() { return Grass.#DEFAULT_TEXTURE }
}