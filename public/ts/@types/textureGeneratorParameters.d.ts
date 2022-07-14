interface TextureGeneratorParameters {
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    params: TextureParameters
    setSize(width: number, height?: number): void
    setBackground(color: CanvasFillStyle): void
}