/**
 * Abstract texture class.
 */
abstract class Texture {
    abstract image: TextureImage
    abstract update(params?: object): Promise<void>
}


/**
 * Texture, that can be loaded from url.
 */
class WebTexture {

    image: TextureImage

    readonly url: string


    /**
     * Use Texture.Load instead.
     */
    private constructor(image: TextureImage, url: string) {
        this.url = url
        this.image = image
    }


    /**
     * Load texture from url. Should be used instead of constructor.
     */
    static async Load(url: string): Promise<WebTexture> {
        const image = await WebTexture.LoadImage(url)
        return new WebTexture(image, url)
    }


    static async LoadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
    
            img.onload = () => {
                resolve(img)
            }
    
            img.onerror = reject
            img.src = url
        })
    }

    
    async update() {
        this.image = await WebTexture.LoadImage(this.url)
    }
}


/**
 * Texture, generated from function using canvas.
 */
class GeneratedTexture extends Texture {

    image: TextureImage

    private generator: TextureGenerator


    constructor(generator: TextureGenerator) {
        super()
        this.generator = generator
        this.image = GeneratedTexture.GenerateImage(generator)
    }


    static GenerateImage(generator: TextureGenerator, params = {}): TextureImage {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

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

        generatorParams.setSize(16) // TODO
        generator(generatorParams)

        return canvas
    }


    async update(params = {}): Promise<void> {
        this.image = GeneratedTexture.GenerateImage(this.generator, params)
    }
}


export { Texture, WebTexture, GeneratedTexture }
export default Texture