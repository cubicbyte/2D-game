import EventHandler from './utils/eventHandler.js'

export default class CameraRenderingParameters {
    EventHandler = new EventHandler(['zoomchange', 'statechange'])

    readonly MAX_ZOOM = 10
    readonly MIN_ZOOM = 0.5
    private _enabled = true
    private _zoom = this.defaultZoom

    get defaultZoom() { return Number(Math.max(innerWidth, innerHeight) / 512) }
    get zoom() { return this._zoom }
    get enabled() { return this._enabled }
    
    set zoom(value: number) {
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

    set enabled(flag: boolean) {
        this._enabled = flag
    }
}