import WorldUpdateParameters from './worldUpdateParameters.js'

export default class WorldUpdate {
    private _parameters = new WorldUpdateParameters()
    private _updateBuffer = new Set<WorldUpdateBufferObject>()

    addToBuffer(object: WorldUpdateBufferObject) {
        this._updateBuffer.add(object)
    }

    private _update() {
        const buffer = Array.from(this._updateBuffer)

        buffer.forEach(object => {
            this._updateBuffer.delete(object)
            object.callback()
        })
    }

    constructor() {
        this._parameters.event.setEventHandler('update', this._update.bind(this))
    }

    get updateBuffer() { return Array.from(this._updateBuffer) }
    get parameters() { return this._parameters }
}