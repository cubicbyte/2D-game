import { validateObject, validateFinite, validateInstance, validateBoolean } from './dataValidator.js'
import EventHandler from './Event.js'
import Position from './Position.js'
import Renderer from './Renderer.js'
import World from './World.js'

export default class Camera {
    #position = new Position()
    #rendering = class {
        static #renderers = new Set()
        static #renderersContainer = null
        static #parameters = class {
            static EventHandler = new EventHandler(['zoomchange', 'statechange'])

            static #MAX_ZOOM = 10
            static #MIN_ZOOM = 0.5
            static #enabled = true
            static #zoom = this.defaultZoom

            static get defaultZoom() { return Number(Math.max(innerWidth, innerHeight) / 512) }
            static get zoom() { return this.#zoom }
            static get enabled() { return this.#enabled }
            static set zoom(value) {
                validateFinite(value, 'Zoom')

                if (value < this.#MIN_ZOOM) {
                    value = this.#MIN_ZOOM
                }
                else if (value > this.#MAX_ZOOM) {
                    value = this.#MAX_ZOOM
                }

                value = Number(value.toFixed(2))

                this.EventHandler
                    .getEventListeners('zoomchange')
                    .forEach(listener => listener(value, this.#zoom))
                
                this.#zoom = value
            }
            static set enabled(flag) {
                validateBoolean(flag, 'Rendering state')
                this.#enabled = flag
            }
        }

        static #render() {
            if (this.parameters.enabled) {
                this.#renderers.forEach(renderer => {
                    renderer.render()
                })
            }
            
            requestAnimationFrame(this.#render.bind(this))
        }

        static addRenderer(renderer) {
            validateInstance(renderer, Renderer, 'Camera renderer')
            this.#renderers.add(renderer)

            if (this.#renderersContainer) {
                this.#renderersContainer.appendChild(renderer.canvas)
                renderer.canvas.width = this.#renderersContainer.offsetWidth
                renderer.canvas.height = this.#renderersContainer.offsetHeight
            }
        }
    
        static removeRenderer(renderer) {
            return this.#renderers.delete(renderer)
        }

        static get renderersContainer() { return this.#renderersContainer }
        static get parameters() { return this.#parameters }

        static set renderersContainer(element) {
            validateInstance(element, HTMLElement, 'Renderers container')
            this.#renderersContainer = element
            this.#renderers.forEach(renderer => {
                element.appendChild(renderer.canvas)
                renderer.canvas.width = this.#renderersContainer.offsetWidth
                renderer.canvas.height = this.#renderersContainer.offsetHeight
            })
        }

        static {
            this.#render()
        }
    }

    constructor(params = {}) {
        validateObject(params, 'Camera parameters')

        if (params.renderersContainer) {
            this.rendering.renderersContainer = params.renderersContainer
        }

        const wheel = event => {
            const dx = event.deltaX
            const dy = event.deltaY

            if (dx != 0) this.rendering.parameters.zoom = this.rendering.parameters.defaultZoom
            else if (dy > 0) this.rendering.parameters.zoom /= 1.05
            else if (dy < 0) this.rendering.parameters.zoom *= 1.05
        }

        document.body.addEventListener('wheel', wheel)
    }

    get position() { return this.#position }
    get rendering() { return this.#rendering }

    static DefaultWorldRenderer(world, camera) {
        validateInstance(world, World, 'World')

        function drawImage(ctx, zoom, image, x, y) {
            ctx.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                Math.floor(x * zoom),
                Math.floor(y * zoom),
                Math.floor(image.width * zoom) + 1,
                Math.floor(image.height * zoom) + 1
            )
        }

        return new Renderer(function(ctx, canvas) {
            ctx.imageSmoothingEnabled = false
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const zoom = camera.rendering.parameters.zoom
            const { width, height } = canvas
            let { x, y } = camera.position
            x -= Math.floor((canvas.width / 2) / zoom)
            y -= Math.floor((canvas.height / 2) / zoom)

            for (let i = 0; i < width / 16 / zoom + 2; i++) {
                for (let j = 0; j < height / 16 / zoom + 2; j++) {
                    const cellIndex = {
                        x: Math.floor(x / 16) + i,
                        y: Math.floor(y / 16) + j
                    }

                    if (x >= 0 || x % 16 === 0) {
                        cellIndex.x -= 1
                    }

                    if (y >= 0 || y % 16 === 0) {
                        cellIndex.y -= 1
                    }

                    if (
                        cellIndex.x >= world.worldData.width ||
                        cellIndex.y >= world.worldData.height ||
                        cellIndex.x < 0 ||
                        cellIndex.y < 0
                    ) {
                        continue
                    }

                    const cell = world.worldData.worldMatrix[cellIndex.x][cellIndex.y]
                    const cellX = i * 16 - x % 16 - 16
                    const cellY = j * 16 - y % 16 - 16

                    drawImage(ctx, zoom, cell.texture.texture, cellX, cellY)
                }
            }
        })
    }
}