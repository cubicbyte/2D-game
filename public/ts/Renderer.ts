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

        this._renderingFunction = params.renderingFunction
        
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

    public render() {
        const params: RenderingFunctionParameters = {
            ctx: this._ctx,
            canvas: this._canvas,
            clearCanvas: () => {
                this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            }
        }

        this._renderingFunction(params)
    }

    public get canvas() { return this._canvas }
    public get ctx() { return this._ctx }
    public get renderingFunction() { return this._renderingFunction }

    public set canvas(element: HTMLCanvasElement) {
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

    public set renderingFunction(renderingFunction: RenderingFunction) {
        this._renderingFunction = renderingFunction
    }
}