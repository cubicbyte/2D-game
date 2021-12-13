export default class Control {
    #object
    #keys
    #keyDownListener
    #keyUpListener
    #speedX
    #speedY
    #running
    #interval
    #element
    #updateInterval

    constructor(params = {}) {
        if (!(params instanceof Object))
            throw new TypeError("Invalid parameters")
        if (!(params.object instanceof Object))
            throw new TypeError("Invalid object")

        this.#object = params.object
        this.#updateInterval = 4
        this.#speedX = 2
        this.#speedY = 2
        this.#running = false
        this.#element = document.body
        this.#keys = {
            top: {
                key: "KeyW",
                pressed: false
            },
            right: {
                key: "KeyD",
                pressed: false
            },
            down: {
                key: "KeyS",
                pressed: false
            },
            left: {
                key: "KeyA",
                pressed: false
            }
        }

        if (params.element instanceof HTMLElement)
            this.#element = params.element

        if (!Number.isInteger(Math.floor(params.object.x)))
            this.#object.x = 0
        if (!Number.isInteger(Math.floor(params.object.y)))
            this.#object.y = 0
        if (Number.isInteger(Math.floor(params.speedX)))
            this.#speedX = params.speedX
        if (Number.isInteger(Math.floor(params.speedY)))
            this.#speedY = params.speedY
        if (Number.isInteger(params.interval) && params.interval > 0)
            this.#updateInterval = params.interval
        
        if (typeof params.top === "string")
            this.#keys.top.key = params.top
        if (typeof params.right === "string")
            this.#keys.right.key = params.right
        if (typeof params.down === "string")
            this.#keys.down.key = params.down
        if (typeof params.left === "string")
            this.#keys.left.key = params.left

        this.#keyDownListener = event => {
            if (event.code === this.#keys.top.key) this.#keys.top.pressed = true
            if (event.code === this.#keys.right.key) this.#keys.right.pressed = true
            if (event.code === this.#keys.down.key) this.#keys.down.pressed = true
            if (event.code === this.#keys.left.key) this.#keys.left.pressed = true
        }

        this.#keyUpListener = event => {
            if (event.code === this.#keys.top.key) this.#keys.top.pressed = false
            if (event.code === this.#keys.right.key) this.#keys.right.pressed = false
            if (event.code === this.#keys.down.key) this.#keys.down.pressed = false
            if (event.code === this.#keys.left.key) this.#keys.left.pressed = false
        }

        this.#element.addEventListener("keydown", this.#keyDownListener)
        this.#element.addEventListener("keyup", this.#keyUpListener)
    }

    start() {
        if (this.#running)
            return new Error("Control is already running")
        
        this.#running = true
        this.#interval = setInterval(() => this.update(), this.#updateInterval)
    }

    stop() {
        if (!this.#running)
            return new Error("Control is already stopped")
        
        this.#running = false
        clearInterval(this.#interval)
    }

    remove() {
        this.#element.removeEventListener("keydown", this.#keyDownListener)
        this.#element.removeEventListener("keyup", this.#keyUpListener)
        clearInterval(this.#interval)
    }

    update() {
        if (this.#keys.top.pressed) this.#object.y -= this.#speedY
        if (this.#keys.right.pressed) this.#object.x += this.#speedX
        if (this.#keys.down.pressed) this.#object.y += this.#speedY
        if (this.#keys.left.pressed) this.#object.x -= this.#speedX
    }

    get object() { return this.#object }
    get speedX() { return this.#speedX }
    get speedY() { return this.#speedY }
    get running() { return this.#running }
    get element() { return this.#element }
    get updateInterval() { return this.#updateInterval }

    set object(object) {
        if (!(object instanceof Object))
            throw new TypeError("Invalid object")
        if (!Number.isInteger(Math.floor(object.x)))
            object.x = 0
        if (!Number.isInteger(Math.floor(object.y)))
            object.y = 0

        this.#object = object
    }

    set speedX(speed) {
        if (!Number.isInteger(~speed))
            throw new TypeError("Invalid speed")
        
        this.#speedX = speed
    }

    set speedY(speed) {
        if (!Number.isInteger(~speed))
            throw new TypeError("Invalid speed")
        
        this.#speedY = speed
    }

    set element(element) {
        if (!(element instanceof HTMLElement))
            throw new Error("Invalid element")
        
        this.#element.removeEventListener("keydown", this.#keyDownListener)
        this.#element.removeEventListener("keyup", this.#keyUpListener)
        this.#element = element
        this.#element.addEventListener("keydown", this.#keyDownListener)
        this.#element.addEventListener("keyup", this.#keyUpListener)
    }

    set updateInterval(interval) {
        if (!Number.isInteger(interval) || interval < 0)
            throw new TypeError("Invalid interval")
        
        clearInterval(this.#interval)
        this.#interval = setInterval(() => this.update(), this.#updateInterval)
    }
}