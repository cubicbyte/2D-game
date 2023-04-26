export default class Control {
    private _running: boolean = false
    private _interval?: ReturnType<typeof setInterval>
    private _updateInterval: number = 4

    public speed: number = 2
    public object: ControlObject

    private _keys: ControlKeys = {
        top: { key: 'KeyW', pressed: false },
        right: { key: 'KeyD', pressed: false },
        down: { key: 'KeyS', pressed: false },
        left: { key: 'KeyA', pressed: false }
    }

    constructor(params: ControlParameters) {
        this.object = params.object

        document.body.addEventListener('keydown', this._keyDownListener.bind(this))
        document.body.addEventListener('keyup', this._keyUpListener.bind(this))
    }

    private _keyDownListener(event: KeyboardEvent) {
        if (event.code === this._keys.top.key) this._keys.top.pressed = true
        if (event.code === this._keys.right.key) this._keys.right.pressed = true
        if (event.code === this._keys.down.key) this._keys.down.pressed = true
        if (event.code === this._keys.left.key) this._keys.left.pressed = true
    }

    private _keyUpListener(event: KeyboardEvent) {
        if (event.code === this._keys.top.key) this._keys.top.pressed = false
        if (event.code === this._keys.right.key) this._keys.right.pressed = false
        if (event.code === this._keys.down.key) this._keys.down.pressed = false
        if (event.code === this._keys.left.key) this._keys.left.pressed = false
    }

    public start() {
        if (this._running) {
            return new Error('Control is already running')
        }

        this._running = true
        this._interval = setInterval(this.update.bind(this), this._updateInterval)
    }

    public stop() {
        if (!this._running) {
            return new Error('Control is already stopped')
        }
        
        this._running = false
        clearInterval(this._interval)
    }

    public remove() {
        document.body.removeEventListener('keydown', this._keyDownListener)
        document.body.removeEventListener('keyup', this._keyUpListener)

        clearInterval(this._interval)
    }

    public update() {
        if (this._keys.top.pressed) this.object.y -= this.speed
        if (this._keys.right.pressed) this.object.x += this.speed
        if (this._keys.down.pressed) this.object.y += this.speed
        if (this._keys.left.pressed) this.object.x -= this.speed
    }

    get running() { return this._running }
    get updateInterval() { return this._updateInterval }

    set updateInterval(interval) {
        if (!Number.isInteger(interval) || interval < 0) {
            throw new TypeError('Invalid interval')
        }
        
        clearInterval(this._interval)
        this._interval = setInterval(this.update.bind(this), this._updateInterval)
    }
}