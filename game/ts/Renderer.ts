export default class Renderer {
    private _canvas = document.createElement('canvas')
    private _ctx: CanvasRenderingContext2D
    private _renderingFunction: RenderingFunction

    constructor(params: RendererParameters | RenderingFunction = () => {}) {
        if (params instanceof Function) {
            params = {
                renderingFunction: params
            }
        }
        
        const ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D

        this._renderingFunction = params.renderingFunction
        this._ctx = ctx
    }

    render() {
        const params: RenderingFunctionParameters = {
            ctx: this._ctx,
            canvas: this._canvas,
            clearCanvas: () => {
                this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            }
        }

        this._renderingFunction(params)
    }

    get canvas() { return this._canvas }
    get ctx() { return this._ctx }
    get renderingFunction() { return this._renderingFunction }

    set canvas(element: HTMLCanvasElement) {
        this._canvas = element
        const ctx = this._canvas.getContext('2d')

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

        this._ctx = ctx
    }

    set renderingFunction(renderingFunction: RenderingFunction) {
        this._renderingFunction = renderingFunction
    }
}