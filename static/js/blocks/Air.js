import { isPositiveInteger, validateBoolean } from '../dataValidator.js'
import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Air extends Block {
    static #DEFAULT_TEXTURE = new Texture().create(function(ctx, canvas, params) {
        if (!isPositiveInteger(params.size)) {
            params.size = 16
        }

        this.setSize(params.size)
        this.setBackground('#87CEEB')
    })

    get texture() { return Air.texture }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
}