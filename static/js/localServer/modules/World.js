import WorldData from './WorldData.js'

export default class World {
    WorldData = new WorldData()

    #id = null
    #registered = false

    register(id) {
        this.#id = id
        this.#registered = true
        delete this.register
    }

    get id() { return this.#id }
    get registered() { return this.#registered }
}