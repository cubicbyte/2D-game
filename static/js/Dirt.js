import { isPositiveInteger } from './dataValidator.js'
import random from './random.js'
import Block from './Block.js'
import Texture from './Texture.js'

export default class Dirt extends Block {
    static #DEFAULT_TEXTURE = new Texture().create(function(ctx, canvas, params) {
        if (!isPositiveInteger(params.size)) {
            params.size = 16
        }

        this.setSize(params.size)
        this.setBackground('#734f2b')

        function fillRandomPixel(color) {
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

    get texture() { return Dirt.#DEFAULT_TEXTURE }
}