export default class HzCounter {
    #Hz = 0
    #lastCall = Date.now()

    update() {
        const now = Date.now()
        const delta = (now - this.#lastCall) / 1000
        
        this.#lastCall = now
        this.#Hz = Math.floor(1 / delta)
    }

    get Hz() { return this.#Hz }
}