export default class Texture {
    private _texture: TextureImage = new Image()
    private _generator: TextureGenerator | null = null
    private _url: string | null = null

    constructor(
        public parameters: TextureParameters = {}
    ) {}

    public static CreateImage(generator: TextureGenerator, params: TextureParameters = {}): TextureImage {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        /**
         * 
         * TODO: 
         * Как-то решить этот костыль.
         * Объективно, это недоработка TypeScript
         * 
         */ 
        if (!ctx) {
            throw new TypeError('ctx is null')
        }

        const generatorParams: TextureGeneratorParameters = {
            ctx,
            canvas,
            params,
            setSize(width: number, height: number = width) {
                canvas.width = width
                canvas.height = height
            },
            setBackground(color: CanvasFillStyle) {
                ctx.fillStyle = color
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
        }

        generator(generatorParams)
        return canvas
    }

    public static async LoadFromUrl(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
    
            img.onload = () => {
                resolve(img)
            }
    
            img.onerror = reject
            img.src = url
        })
    }

    public create(generator: TextureGenerator): Texture {
        const texture = Texture.CreateImage(generator, this.parameters)

        this._texture = texture
        this._generator = generator
        this._url = null

        return this
    }

    public async loadFromUrl(url: string): Promise<Texture> {
        const image = await Texture.LoadFromUrl(url)

        this._texture = image
        this._url = url
        this._generator = null

        return this
    }

    public async update(params?: TextureParameters) {
        if (params) {
            for (const key in params) {
                this.parameters[key] = params[key]
            }
        }

        if (this._generator) {
            this.create(this._generator)
        } else if (this._url) {
            await this.loadFromUrl(this._url)
        }
    }

    public get texture(): TextureImage { return this._texture }

    public set texture(image: TextureImage) {
        this._texture = image
        this._generator = null
        this._url = null
    }
}