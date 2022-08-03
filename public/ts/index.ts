import sleep from './utils/sleep.js'
import checkColl from './utils/checkColl.js'
import Camera from './Camera.js'
import Water from './blocks/Water.js'
import Dirt from './blocks/Dirt.js'
import Log from './blocks/Log.js'
import Leaves from './blocks/Leaves.js'
import Stone from './blocks/Stone.js'
import IronOre from './blocks/IronOre.js'
import Cobblestone from './blocks/Cobblestone.js'
import Bedrock from './blocks/Bedrock.js'
import Sand from './blocks/Sand.js'
import Renderer from './Renderer.js'
import Control from './utils/Control.js'
import HZCounter from './utils/HzCounter.js'
import Grass from './blocks/Grass.js'
import Air from './blocks/Air.js'
import isWithinMatrix from './utils/isWithinMatrix.js'
import World from './World.js'
import declareGlobalVar from './declareGlobalVar.js'

import { DefaultWorld } from './defaultWorld.js'
import { DefaultWorld as DefaultWorldGenerator } from './worldGenerators.js'
import Block from './block.js'


/**
 * 
 * TODO:
 * 
 * 1. На данный момент world update buffer принимает в роли уникального ключа позицию
 * обновляемой ячейки. Это плохо, так как допустим следующую ситуацию:
 * 
 * У нас в буффере есть записи для 2 ячеек: 1:1 и 1:2.
 * Если обновится блок в ячейке 1:1, после чего
 * он переместится в ячейку 1:2, то при обновлении соотвествующей
 * ячейки этот блок обновится повторно, в одной сессии обновления.
 * 
 * 
 * 
 */


function getElement<T extends HTMLElement>(selector: string): T {
    const element: T | null = document.querySelector(selector)

    if (!element) {
        throw new Error(`Element with selector "${selector}" does not exists`)
    }

    return element
}

!async function() {
    /*const worker = new Worker('js/localServer/worker.js')

    const workerMessageHandlers = {
        'change-world'(world: World) {
            console.log(world)
        }
    }

    worker.onmessage = message => {
        const msg = message.data

        console.log(`Message from worker`, msg)
    }
    
    worker.postMessage({
        type: 'create-world',
        parameters: {
            worldType: 'default',
            width: 48,
            height: 32
        }
    })*/

    const WORLD_WIDTH = 48
    const WORLD_HEIGHT = 32

    const progress: HTMLProgressElement = getElement('.loader progress')
    const progressTitle: HTMLParagraphElement = getElement('.loader p')

    function getCellIndex(x: number, y: number): [number, number] {
        return [
            Math.floor(
                (
                    x / camera.rendering.parameters.zoom
                    + camera.position.x
                    - Math.floor(
                        (GUIRenderer.canvas.width / 2)
                        / camera.rendering.parameters.zoom
                    )
                ) / 16
            ),
            Math.floor(
                (
                    y / camera.rendering.parameters.zoom
                    + camera.position.y
                    - Math.floor(
                        (GUIRenderer.canvas.height / 2)
                        / camera.rendering.parameters.zoom
                    )
                ) / 16
            )
        ]
    }

    let start = Date.now()
    console.log('Генерация мира...')
    progressTitle.innerText = 'Генерация мира...'

    const world = new DefaultWorld.World()

    declareGlobalVar('world', world)

    let current = 0
    let accuracy = 0.05
    await world.worldData.generateWorld(WORLD_WIDTH, WORLD_HEIGHT, DefaultWorldGenerator.Generator.create({
        async onprogress(progressValue: number) {
            progress.value = progressValue
            if (progressValue > current + accuracy) {
                current += accuracy
                await sleep(0)
            }
        },
        groundAltitudeOffset: 0
    }))

    const water = new Sand()
    world.worldData.setBlock(4, 4, water)
    console.log(water)

    console.log(`Генерация мира окончена. Время: ${Date.now() - start}мс`)

    start = Date.now()
    console.log('Компиляция текстур...')
    progressTitle.innerText = 'Компиляция текстур...'

    await Log.LoadTexture?.()
    await Leaves.LoadTexture?.()
    await Stone.LoadTexture?.()
    await IronOre.LoadTexture?.()
    await Cobblestone.LoadTexture?.()
    await Bedrock.LoadTexture?.()
    await Sand.LoadTexture?.()

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
        renderersContainer: getElement('.canvas-wrapper')
    })

    const cameraControl = new Control({
        object: camera.position
    })

    const hzCounter = new HZCounter()
    const worldRenderer = Camera.DefaultWorldRenderer(world, camera)
    const GUIRenderer = new Renderer(({ ctx, canvas, clearCanvas }) => {
        const infoText = [
            `FPS: ${hzCounter.hz}`,
            `Zoom: ${camera.rendering.parameters.zoom}`,
            `X: ${camera.position.x}`,
            `Y: ${camera.position.y}`,
            `Cursor: ${getCellIndex(...cursorPosition)}`,
            `Update_buffer: ${world.worldData.update.updateBuffer.size}`
        ]

        clearCanvas()

        const TEXT_PADDING = 15
        ctx.fillStyle = '#000000'

        infoText.forEach((text, i) => {
            ctx.fillText(text, TEXT_PADDING, TEXT_PADDING * i + TEXT_PADDING)
        })

        cameraControl.update()
        hzCounter.update()

        const texture = picked ? picked.DEFAULT_TEXTURE.texture : new Image(16, 16)
        const x = canvas.width - texture.width * 4 - 16
        const y = canvas.height - texture.height * 4 - 16

        ctx.fillStyle = 'rgba(0,0,0,0.6)'
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

    let picked: typeof Dirt | null = Dirt
    let cursorPosition: [number, number] = [0, 0]

    GUIRenderer.canvas.addEventListener('mousemove', event => {
        cursorPosition = [event.offsetX, event.offsetY]
    })

    GUIRenderer.canvas.addEventListener('click', event => {
        const { width, height } = GUIRenderer.canvas
        const { offsetX: x, offsetY: y } = event

        const texture = picked ? picked.DEFAULT_TEXTURE.texture : new Image(16, 16)
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

        const cellIndex = getCellIndex(event.offsetX, event.offsetY)
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
                cell.block.texture.update()
                cell.texture.update()
                world.worldData.updateNearestBlocks(...cellIndex)
            }
        } else if (event.shiftKey) {
            if (cell.block === null) {
                world.worldData.setBlock(...cellIndex, new Sand())
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

    /*GUIRenderer.canvas.addEventListener('mousedown', event => {
        if (event.button === 1) {
            const cellIndex = getCellIndex(event.offsetX, event.offsetY)
            const cell = world.worldData.getCell(...cellIndex)
            
            if (!cell) {
                return false
            }

            event.preventDefault()
            
            picked =
                event.ctrlKey
                    ? cell.wall
                        ? cell.wall.constructor.name
                        : null
                    : cell.block
                        ? cell.block.constructor.name
                        : null
        }
    })*/

    /**
     * 
     * TODO:
     * Добавить функциональность куску кода выше
     * после реализации размещения блоков по ID
     * 
     */

    GUIRenderer.canvas.addEventListener('contextmenu', event => {
        const cellIndex = getCellIndex(event.offsetX, event.offsetY)
        const cell = world.worldData.getCell(...cellIndex)
        
        if (!cell) {
            return false
        }

        event.preventDefault()

        if (event.ctrlKey) {
            if (cell.wall === null && picked !== null) {
                cell.wall = new picked()
                cell.texture.update()
            }
        } else {
            if (cell.block === null && picked !== null) {
                world.worldData.setBlock(...cellIndex, new picked())
            }
        }
    })

    window.addEventListener('resize', () => {
        if (!camera.rendering.parameters.enabled) {
            return
        }
        
        const wrapper = getElement('.canvas-wrapper')

        wrapper.style.width = innerWidth + 'px'
        wrapper.style.height = innerHeight + 'px'

        wrapper.querySelectorAll('canvas').forEach(canvas => {
            canvas.width = innerWidth
            canvas.height = innerHeight
        })

        camera.rendering.parameters.zoom = camera.rendering.parameters.defaultZoom
    })

    getElement('.loader').style.display = 'none'
}()