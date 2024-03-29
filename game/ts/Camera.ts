import CameraRendering from './cameraRendering.js'
import Position from './Position.js'
import Renderer from './Renderer.js'
import World, { WorldCell } from './World.js'

export default class Camera {

    readonly position = new Position()
    readonly rendering = new CameraRendering()


    private static WheelHandler(this: Camera, event: WheelEvent) {
        const dx = event.deltaX
        const dy = event.deltaY

        if (dx != 0) this.rendering.parameters.zoom = this.rendering.parameters.defaultZoom
        else if (dy > 0) this.rendering.parameters.zoom /= 1.05
        else if (dy < 0) this.rendering.parameters.zoom *= 1.05
    }


    constructor(params: CameraParameters = {}) {
        if (params.renderersContainer) {
            this.rendering.renderersContainer = params.renderersContainer
        }

        document.body.addEventListener('wheel', Camera.WheelHandler.bind(this))
    }


    getCellIndex(x: number, y: number, width: number, height: number): [number, number] {
        return [
            Math.floor(
                (
                    x / this.rendering.parameters.zoom
                    + this.position.x
                    - Math.floor(
                        (width / 2)
                        / this.rendering.parameters.zoom
                    )
                ) / 16
            ),
            Math.floor(
                (
                    y / this.rendering.parameters.zoom
                    + this.position.y
                    - Math.floor(
                        (height / 2)
                        / this.rendering.parameters.zoom
                    )
                ) / 16
            )
        ]
    }


    static DefaultWorldRenderer(world: World, camera: Camera) {
        return new Renderer(this.DefaultWorldRenderingFunction.bind(this, world, camera))
    }


    static DefaultWorldRenderingFunction( world: World, camera: Camera, { ctx, canvas, clearCanvas }: RenderingFunctionParameters) {
        clearCanvas()
        ctx.imageSmoothingEnabled = false

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

                const cell = world.worldData.getCell(cellIndex.x, cellIndex.y) as WorldCell
                const cellX = i * 16 - x % 16 - 16
                const cellY = j * 16 - y % 16 - 16

                ctx.drawImage(
                    cell.texture.image,
                    0,
                    0,
                    cell.texture.image.width,
                    cell.texture.image.height,
                    Math.floor(cellX * zoom),
                    Math.floor(cellY * zoom),
                    Math.floor(cell.texture.image.width * zoom) + 1,
                    Math.floor(cell.texture.image.height * zoom) + 1
                )
            }
        }
    }
}