import EventHandler from './utils/eventHandler.js'

export default class WorldUpdateParameters {
    static readonly DEFAULT_UPDATE_PERIOD = 1000/20
    
    private _updatePeriod: number = WorldUpdateParameters.DEFAULT_UPDATE_PERIOD
    private _updateInterval?: ReturnType<typeof setInterval>
    private _enabled: boolean = false
    
    event = new EventHandler([ 'update' ])
    
    constructor() {
        this.enabled = true
    }

    private _updateState() {
        if (!this._enabled) {
            if (this._updateInterval !== null) {
                clearInterval(this._updateInterval)
            }

            return
        }

        clearInterval(this._updateInterval)
        this._updateInterval = setInterval(this._update.bind(this), this._updatePeriod)
    }
    
    private _update() {
        const updateFunction = this.event.getEventHandler('update')

        if (!updateFunction) {
            throw new Error('World update handler is null')
        }

        updateFunction()
    }

    get updatePeriod() { return this._updatePeriod }
    get enabled() { return this._enabled }

    set updatePeriod(value: number) {
        this._updatePeriod = value
        this._updateState()
    }

    set enabled(flag: boolean) {
        this._enabled = flag
        this._updateState()
    }
}