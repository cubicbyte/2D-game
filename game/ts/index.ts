import sleep from './utils/sleep.js'
import checkColl from './utils/checkColl.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Control from './utils/Control.js'
import HZCounter from './utils/HzCounter.js'
import World from './World.js'
import Engine from './engine.js'
import { DefaultWorld } from './worldGenerators.js'



!async function() {
    const WORLD_WIDTH = 48
    const WORLD_HEIGHT = 32

    const loader = document.querySelector('.loader') as HTMLElement
    const progress = document.querySelector('.loader progress') as HTMLProgressElement
    const progressTitle = document.querySelector('.loader p') as HTMLParagraphElement

    await Engine.setup()

    let start = Date.now()
    console.log('Генерация мира...')
    progressTitle.innerText = 'Генерация мира...'

    const world = new World()

    let current = 0
    let accuracy = 0.05
    await world.worldData.generateWorld(WORLD_WIDTH, WORLD_HEIGHT, DefaultWorld.Generator.create({
        async onprogress(progressValue: number) {
            progress.value = progressValue
            if (progressValue > current + accuracy) {
                current += accuracy
                await sleep(0)
            }
        },
        groundAltitudeOffset: 0
    }))

    world.worldData.setBlock(4, 4, new (Engine.getBlockById('game:water') as BlockSubclass)())

    console.log(`Генерация мира окончена. Время: ${Date.now() - start}мс`)

    start = Date.now()
    console.log('Компиляция текстур...')
    progressTitle.innerText = 'Компиляция текстур...'

    current = 0
    await world.updateTextures({
        async onprogress(progressValue: number) {
            progress.value = progressValue
            if (progressValue > current + accuracy) {
                current += accuracy
                await sleep(0)
            }
        }
    })

    console.log(`Компиляция текстур окончена. Время: ${Date.now() - start}мс`)
    progressTitle.innerText = 'Готово'

    const camera = new Camera({
        renderersContainer: document.querySelector('.canvas-wrapper') as HTMLElement
    })

    const cameraControl = new Control({
        object: camera.position
    })

    const hzCounter = new HZCounter()
    const worldRenderer = Camera.DefaultWorldRenderer(world, camera)
    const GUIRenderer = new Renderer(function({ ctx, canvas, clearCanvas }) {
        clearCanvas()
        ctx.imageSmoothingEnabled = false

        const PICKED_BG_OPACITY = 0.6

        const DEBUG_BG_OPACITY = 0.4
        const DEBUG_MENU_WIDTH = 300
        const DEBUG_TEXT_OFFSET = 15
        const DEBUG_TEXT_SPACING = 5
        const DEBUG_TEXT_FONT_SIZE = 15

        const camPosTruncated = camera.position.truncated
        const debugText = [
            `FPS: ${hzCounter.hz}`,
            `Zoom: ${camera.rendering.parameters.zoom}`,
            `X: ${camPosTruncated.x}`,
            `Y: ${camPosTruncated.y}`,
            `Cursor: ${camera.getCellIndex(...cursorPosition, GUIRenderer.canvas.width, GUIRenderer.canvas.height)}`,
            `Update_buffer: ${world.worldData.update.updateBuffer.length}`
        ]


        // Draw debug menu
        ctx.fillStyle = `rgba(0,0,0,${DEBUG_BG_OPACITY})`
        ctx.fillRect(0, 0, DEBUG_MENU_WIDTH, (debugText.length - 1) * (DEBUG_TEXT_OFFSET + DEBUG_TEXT_SPACING) + DEBUG_TEXT_OFFSET * 2)

        // Draw debug text
        ctx.font = `${DEBUG_TEXT_FONT_SIZE}px monospace`
        ctx.fillStyle = '#ffffff'

        for (const [i, text] of debugText.entries()) {
            ctx.fillText(text, DEBUG_TEXT_OFFSET, (DEBUG_TEXT_FONT_SIZE + DEBUG_TEXT_SPACING) * (i + 1))
        }


        cameraControl.update()
        hzCounter.update()

        const texture = picked ? Engine.getTexture(picked).image : new Image(16, 16)
        const x = canvas.width - texture.width * 4 - 16
        const y = canvas.height - texture.height * 4 - 16

        ctx.fillStyle = `rgba(0,0,0,${PICKED_BG_OPACITY})`
        ctx.fillRect(
            x - 4,
            y - 4,
            texture.width * 4 + 8,
            texture.height * 4 + 8
        )

        ctx.clearRect(x, y, texture.width * 4, texture.height * 4)

        ctx.drawImage(
            texture,
            0,
            0,
            texture.width,
            texture.height,
            x,
            y,
            texture.width * 4,
            texture.height * 4
        )
    })

    camera.rendering.addRenderer(worldRenderer)
    camera.rendering.addRenderer(GUIRenderer)
    camera.rendering.parameters.zoom = camera.rendering.parameters.defaultZoom
    camera.position.moveTo(world.worldData.width * 8, world.worldData.height * 8)

    const CAMERA_SPEED = 6

    cameraControl.speed = CAMERA_SPEED / camera.rendering.parameters.zoom
    camera.rendering.parameters.EventHandler.addEventListener('zoomchange',
        (zoom: number) => {
            cameraControl.speed = CAMERA_SPEED / zoom
        }
    )

    let picked: string | null = 'game:dirt'
    let cursorPosition: [number, number] = [0, 0]

    GUIRenderer.canvas.addEventListener('mousemove', event => {
        cursorPosition = [event.offsetX, event.offsetY]
    })

    GUIRenderer.canvas.addEventListener('click', event => {
        const { width, height } = GUIRenderer.canvas
        const { offsetX: x, offsetY: y } = event

        const Water = Engine.getBlockById('game:water') as BlockSubclass
        const texture = picked ? Engine.getTexture(picked).image : new Image(16, 16)
        const isColl = checkColl(
            {
                x: width - texture.width * 4 - 16,
                y: height - texture.height * 4 - 16,
                width: texture.width * 4,
                height: texture.height * 4
            },
            {
                x,
                y,
                width: 1,
                height: 1
            }
        )

        if (isColl) {
            event.preventDefault()
            camera.rendering.parameters.enabled = !camera.rendering.parameters.enabled
            world.worldData.update.parameters.enabled = camera.rendering.parameters.enabled
            return
        }

        const cellIndex = camera.getCellIndex(event.offsetX, event.offsetY, GUIRenderer.canvas.width, GUIRenderer.canvas.height)
        const cell = world.worldData.getCell(...cellIndex)

        if (!cell) {
            return false
        }

        event.preventDefault()

        if (event.altKey) {
            if (cell.block === null) {
                world.worldData.setBlock(...cellIndex, new Water())
                return
            }

            if (cell.block instanceof Water) {
                const water = new Water()

                cell.block.properties.level = Math.min((cell.block.properties.level || 0) + (water.properties.level || 0), (cell.block.properties.minLevel || 0))
                cell.block.getTexture().update()
                cell.texture.update()
                world.worldData.updateNearestBlocks(...cellIndex)
            }
        } else if (event.shiftKey) {
            if (cell.block === null) {
                world.worldData.setBlock(...cellIndex, new (Engine.getBlockById('game:sand') as BlockSubclass)())
            }
        } else if (event.ctrlKey) {
            if (cell.wall !== null) {
                cell.wall = null
                cell.texture.update()
            }
        } else {
            if (cell.block !== null) {
                world.worldData.setBlock(...cellIndex, null)
            }
        }
    })

    GUIRenderer.canvas.addEventListener('mousedown', event => {
        if (event.button === 1) {
            const cellIndex = camera.getCellIndex(event.offsetX, event.offsetY, GUIRenderer.canvas.width, GUIRenderer.canvas.height)
            const cell = world.worldData.getCell(...cellIndex)
            
            if (!cell) {
                return false
            }

            event.preventDefault()
            
            picked =
                event.ctrlKey
                    ? cell.wall
                        ? cell.wall.id
                        : null
                    : cell.block
                        ? cell.block.id
                        : null
        }
    })

    GUIRenderer.canvas.addEventListener('contextmenu', event => {
        const cellIndex = camera.getCellIndex(event.offsetX, event.offsetY, GUIRenderer.canvas.width, GUIRenderer.canvas.height)
        const cell = world.worldData.getCell(...cellIndex)
        
        if (!cell) {
            return false
        }

        event.preventDefault()

        if (event.ctrlKey) {
            if (cell.wall === null && picked !== null) {
                cell.wall = new (Engine.getBlockById(picked) as BlockSubclass)()
                cell.texture.update()
            }
        } else {
            if (cell.block === null && picked !== null) {
                world.worldData.setBlock(...cellIndex, new (Engine.getBlockById(picked) as BlockSubclass)())
            }
        }
    })

    window.addEventListener('resize', () => {
        if (!camera.rendering.parameters.enabled) {
            return
        }
        
        const wrapper = document.querySelector('.canvas-wrapper') as HTMLElement

        wrapper.style.width = innerWidth + 'px'
        wrapper.style.height = innerHeight + 'px'

        wrapper.querySelectorAll('canvas').forEach(canvas => {
            canvas.width = innerWidth
            canvas.height = innerHeight
        })

        camera.rendering.parameters.zoom = camera.rendering.parameters.defaultZoom
    })

    loader.style.display = 'none'

    // Move camera to center of world
    /*camera.position.moveBy(world.worldData.width * 8, world.worldData.height * 8)
    camera.rendering.parameters.zoom = 0.5
    await sleep(100)
    camera.rendering.parameters.enabled = false*/
}()