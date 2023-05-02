export default class HzCounter {
    private _hz = 0
    private _lastCall = Date.now()

    update() {
        const now = Date.now()
        const delta = (now - this._lastCall) / 1000
        
        this._lastCall = now
        this._hz = Math.floor(1 / delta)
    }

    get hz() { return this._hz }
}