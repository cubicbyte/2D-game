type CanvasFillStyle = string | CanvasGradient | CanvasPattern
type TextureImage = HTMLImageElement | HTMLCanvasElement

interface Texture {
    parameters: TextureParameters
    texture: TextureImage
    create(generator: TextureGenerator): import('../Texture').default
    loadFromUrl(url: string): Promise<import('../Texture').default>
    update(params?: TextureParameters): Promise<void>
}

interface TextureGenerator {
    (parameters: TextureGeneratorParameters): Promise<void> | void
}

interface TextureGeneratorParameters {
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    params: TextureParameters
    setSize(width: number, height?: number): void
    setBackground(color: CanvasFillStyle): void
}

interface TextureParameters {
    size?: number
    [key: string]: any
}