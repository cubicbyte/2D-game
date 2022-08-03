import WorldUpdateParameters from './worldUpdateParameters.js'

export default class WorldUpdate {
    private _parameters = new WorldUpdateParameters()
    public updateBuffer = new Set<WorldUpdateBufferObject>()

    private _update() {
        const buffer = Array.from(this.updateBuffer)
        console.log(buffer)

        buffer.forEach(object => {
            this.updateBuffer.delete(object)
            object.callback()
        })
    }

    constructor() {
        this._parameters.event.setEventHandler('update', this._update.bind(this))
    }

    public get parameters() { return this._parameters }
}