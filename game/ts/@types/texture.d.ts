type CanvasFillStyle = string | CanvasGradient | CanvasPattern
type TextureImage = HTMLImageElement | HTMLCanvasElement

interface TextureGenerator {
    (parameters: TextureGeneratorParameters): Promise<void> | void
}

interface TextureGeneratorParameters {
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    params: object
    setSize(width: number, height?: number): void
    setBackground(color: CanvasFillStyle): void
}