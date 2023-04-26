import EventHandler from './utils/eventHandler.js'

export default class CameraRenderingParameters {
    public EventHandler = new EventHandler(['zoomchange', 'statechange'])

    public readonly MAX_ZOOM = 10
    public readonly MIN_ZOOM = 0.5
    private _enabled = true
    private _zoom = this.defaultZoom

    public get defaultZoom() { return Number(Math.max(innerWidth, innerHeight) / 512) }
    public get zoom() { return this._zoom }
    public get enabled() { return this._enabled }
    
    public set zoom(value: number) {
        if (value < this.MIN_ZOOM) {
            value = this.MIN_ZOOM
        } else if (value > this.MAX_ZOOM) {
            value = this.MAX_ZOOM
        }

        value = Number(value.toFixed(2))

        this.EventHandler
            .getEventListeners('zoomchange')
            .forEach(listener => listener(value, this._zoom))
        
        this._zoom = value
    }

    public set enabled(flag: boolean) {
        this._enabled = flag
    }
}