import { validateObject, validateFunction, validateImage, isFunctionAsync } from './dataValidator.js'

export default class Texture {
    #texture = new Image()
    #generator = null
    #url = null

    constructor(data) {
        if (typeof data === 'function') {
            return this.create(data)
        }
    }

    static CreateImage(generator, params = {}) {
        validateFunction(generator, 'Texture generator')
        validateObject(params, 'Parameters')

        const isGeneratorAsync = isFunctionAsync(generator)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const generatorScope = {
            setSize(width, height = width) {
                canvas.width = width
                canvas.height = height
            },
            setBackground(color) {
                ctx.fillStyle = color
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            },
            _generator: generator
        }

        if (isGeneratorAsync) {
            return new Promise(async resolve => {
                await generatorScope._generator(ctx, canvas, params)
                resolve(canvas)
            })
        }

        generatorScope._generator(ctx, canvas, params)
        return canvas
    }

    static LoadFromUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image()

            img.onload = () => {
                resolve(img)
            }

            img.onerror = reject
            img.src = url
        })
    }

    create(generator) {
        const isGeneratorAsync = isFunctionAsync(generator)

        if (isGeneratorAsync) {
            return new Promise(async resolve => {
                this.#texture = await Texture.CreateImage(generator)
                this.#generator = generator
                this.#url = null

                resolve(this)
            })
        }

        this.#texture = Texture.CreateImage(generator)
        this.#generator = generator
        this.#url = null

        return this
    }

    async loadFromUrl(url) {
        const image = await Texture.LoadFromUrl(url)

        this.#texture = image
        this.#url = url
        this.#generator = null
    }

    update(params = {}) {
        if (this.#generator) {
            const isGeneratorAsync = isFunctionAsync(this.#generator)
        
            if (isGeneratorAsync) {
                return new Promise(async resolve => {
                    this.#texture = await Texture.CreateImage(this.#generator, params)
                    resolve(this)
                })
            }
            
            this.#texture = Texture.CreateImage(this.#generator, params)
            return this
        }
    }

    get texture() { return this.#texture }

    set texture(image) {
        validateImage(image, 'Texture')

        this.#texture = image
        this.#generator = null
        this.#url = null
    }
}