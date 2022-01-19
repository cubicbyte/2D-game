export default class Registration {
    #data = null
    #status = false

    register(data) {
        this.#data = data
        this.#status = true
        delete this.register
    }

    get data() { return this.#data }
    get status() { return this.#status }
}