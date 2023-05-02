interface RendererParameters {
    renderingFunction: RenderingFunction
}

interface RenderingFunction {
    (params: RenderingFunctionParameters): void
}

interface RenderingFunctionParameters {
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    clearCanvas(): void
}