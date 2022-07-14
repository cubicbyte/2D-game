import CameraRenderingParameters from './cameraRenderingParameters.js'
import Renderer from './Renderer.js'

export default class CameraRendering {
    private _renderers = new Set<Renderer>()
    private _renderersContainer: HTMLElement = document.createElement('div')
    private _parameters = new CameraRenderingParameters()

    constructor() {
        this._render()
    }

    private _render() {
        if (this.parameters.enabled) {
            this._renderers.forEach(renderer => {
                renderer.render()
            })
        }
        
        requestAnimationFrame(this._render.bind(this))
    }

    public addRenderer(renderer: Renderer) {
        this._renderers.add(renderer)

        if (this._renderersContainer) {
            renderer.canvas.width = this._renderersContainer.offsetWidth
            renderer.canvas.height = this._renderersContainer.offsetHeight

            this._renderersContainer.appendChild(renderer.canvas)
        }
    }

    public removeRenderer(renderer: Renderer): boolean {
        return this._renderers.delete(renderer)
    }

    public get renderersContainer() { return this._renderersContainer }
    public get parameters() { return this._parameters }

    public set renderersContainer(element: HTMLElement) {
        this._renderersContainer = element
        this._renderers.forEach(renderer => {
            renderer.canvas.width = this._renderersContainer.offsetWidth
            renderer.canvas.height = this._renderersContainer.offsetHeight
            
            element.appendChild(renderer.canvas)
        })
    }
}