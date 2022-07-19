export default class Stick {
    #object  = null
    #element = null
    #radius  = 100
    #speed   = 0.04
    #dx      = 0
    #dy      = 0
    #x       = 0
    #y       = 0

    constructor(object, element) {
        if (object instanceof Object)
            this.object = object
        if (element instanceof HTMLElement)
            this.element = element
    }

    update() {
        this.#object.x += Math.floor(this.#dx * this.#speed)
        this.#object.y += Math.floor(this.#dy * this.#speed)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
        ctx.arc(this.#x, this.#y, this.#radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
        ctx.arc(this.#x + this.#dx, this.#y + this.#dy, this.#radius / 4, 0, Math.PI * 2)
        ctx.fill()
    }

    get object() { return this.#object }
    get element() { return this.#element }
    get radius() { return this.#radius }
    get speed() { return this.#speed }
    get x() { return this.#x }
    get y() { return this.#y }

    set object(object) {
        if (!(object instanceof Object))
            throw new TypeError("Invalid object")
        if (!Number.isInteger(Math.floor(object.x)))
            object.x = 0
        if (!Number.isInteger(Math.floor(object.y)))
            object.y = 0

        this.#object = object
    }

    set element(element) {
        if (!(element instanceof HTMLElement))
            throw new TypeError("Invalid element")

        if (this.#element) {
            this.#element.removeEventListener("touchstart", this.#touchstartHandler)
            this.#element.removeEventListener("mousedown", this.#mousedownHandler)
            this.#element.removeEventListener("touchend", this.#end)
            this.#element.removeEventListener("mouseup", this.#end)
            this.#end()
        }
        
        this.#element = element
        this.#element.addEventListener("touchstart", this.#touchstartHandler)
        this.#element.addEventListener("mousedown", this.#mousedownHandler)
        this.#element.addEventListener("touchend", this.#end)
        this.#element.addEventListener("mouseup", this.#end)
    }

    set radius(radius) { this.#radius = radius }
    set speed(speed) { this.#speed = speed }
    set x(x) { this.#x = x }
    set y(y) { this.#y = y }

    #start = () => {
        this.#element.addEventListener("touchmove", this.#touchmoveHandler)
        this.#element.addEventListener("mousemove", this.#mousemoveHandler)
    }

    #end = () => {
        this.#element.removeEventListener("touchmove", this.#touchmoveHandler)
        this.#element.removeEventListener("mousemove", this.#mousemoveHandler)

        this.#dx = 0
        this.#dy = 0
    }

    #touchstartHandler = event => {
        const x = event.touches[0].pageX - this.#x
        const y = event.touches[0].pageY - this.#y
        const dist = Math.sqrt((x ** 2) + (y ** 2))
        
        if (dist < this.#radius) {
            event.preventDefault()
            this.#start()
        }
    }

    #touchmoveHandler = event => {
        const x = event.touches[0].pageX
        const y = event.touches[0].pageY
        let dx = x - this.#x
        let dy = y - this.#y
        const dist = Math.sqrt((dx ** 2) + (dy ** 2))

        if (dist < this.#radius) {
            this.#dx = dx
            this.#dy = dy
            return
        }

        let alpha = Math.atan(dy / dx)

        if (dx < 0) alpha += Math.PI

        this.#dx = this.#radius * Math.cos(alpha)
        this.#dy = this.#radius * Math.sin(alpha)
    }

    #mousemoveHandler = event => {
        const x = event.layerX
        const y = event.layerY
        let dx = x - this.#x
        let dy = y - this.#y
        const dist = Math.sqrt((dx ** 2) + (dy ** 2))

        if (dist < this.#radius) {
            this.#dx = dx
            this.#dy = dy
            return
        }

        let alpha = Math.atan(dy / dx)

        if (dx < 0) alpha += Math.PI

        this.#dx = this.#radius * Math.cos(alpha)
        this.#dy = this.#radius * Math.sin(alpha)
    }

    #mousedownHandler = event => {
        const x = event.layerX - this.#x
        const y = event.layerY - this.#y
        const dist = Math.sqrt((x ** 2) + (y ** 2))
        
        if (dist < this.#radius)
            this.#start()
    }
}