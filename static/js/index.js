import sleep from './sleep.js'
import checkColl from './checkColl.js'
import DefaultWorld from './DefaultWorld.js'
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
import Control from './Control.js'
import Stick from './Stick.js'
import HZCounter from './HzCounter.js'
import { defaultWorld } from './worldGenerators.js'
import Grass from './blocks/Grass.js'
import Air from './blocks/Air.js'
import { isWithinMatrix } from './dataValidator.js'

const progress = document.querySelector('.loader progress')
const progressTitle = document.querySelector('.loader p')

function getCellIndex(x, y) {
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

const world = new DefaultWorld({
    parameters: {
        size: {
            width: 48,
            height: 32
        }
    }
})

let current = 0
let accuracy = 0.05
await world.generateWorld(defaultWorld({
    async onprogress(progressValue) {
        progress.value = progressValue
        if (progressValue > current + accuracy) {
            current += accuracy
            await sleep()
        }
    },
    groundAltitudeOffset: 0
}))

world.worldData.placeBlock(4, 4, new Water())

console.log(`Генерация мира окончена. Время: ${Date.now() - start}мс`)

start = Date.now()
console.log('Компиляция текстур...')
progressTitle.innerText = 'Компиляция текстур...'

await Log.LoadTexture()
await Leaves.LoadTexture()
await Stone.LoadTexture()
await IronOre.LoadTexture()
await Cobblestone.LoadTexture()
await Bedrock.LoadTexture()
await Sand.LoadTexture()

current = 0
await world.updateTextures({
    async onprogress(progressValue) {
        progress.value = progressValue
        if (progressValue > current + accuracy) {
            current += accuracy
            await sleep()
        }
    }
})

console.log(`Компиляция текстур окончена. Время: ${Date.now() - start}мс`)
progressTitle.innerText = 'Готово'

const camera = new Camera({
    renderersContainer: document.querySelector('.canvas-wrapper'),
    world
})

const cameraStick = new Stick(camera.position)
const cameraControl = new Control({
    object: camera.position
})

const hzCounter = new HZCounter()
const worldRenderer = Camera.DefaultWorldRenderer(world, camera)
const GUIRenderer = new Renderer(function(ctx, { width, height }) {
    const drawImage = (texture, x, y, width, height) => {
        ctx.drawImage(
            texture,
            0,
            0,
            texture.width,
            texture.height,
            x,
            y,
            width,
            height
        )
    }

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = '#000000'
    ctx.fillText(`
    FPS: ${hzCounter.Hz}
    Zoom: ${camera.rendering.parameters.zoom}
    X: ${camera.position.x}
    Y: ${camera.position.y}
    Cursor: ${getCellIndex(...cursorPosition)}
    Update_buffer: ${world.worldData.update.updateBuffer.length}
    `, 5, 15)

    cameraStick.draw(ctx)
    cameraStick.update()
    cameraControl.update()
    hzCounter.update()

    const texture = picked ? picked.texture.texture : new Image(16, 16)
    const x = width - texture.width * 4 - 16
    const y = height - texture.height * 4 - 16

    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(
        x - 4,
        y - 4,
        texture.width * 4 + 8,
        texture.height * 4 + 8
    )

    ctx.clearRect(x, y, texture.width * 4, texture.height * 4)

    drawImage(
        texture,
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
cameraStick.element = GUIRenderer.canvas
cameraStick.x = 120
cameraStick.y = GUIRenderer.canvas.height - 120

let picked = Dirt
let cursorPosition = [0, 0]

GUIRenderer.canvas.addEventListener('mousemove', event => {
    cursorPosition = [event.layerX, event.layerY]
})

GUIRenderer.canvas.addEventListener('click', event => {
    const { width, height } = GUIRenderer.canvas
    const { layerX: x, layerY: y } = event

    const texture = picked ? picked.texture.texture : new Image(16, 16)
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

    const cellIndex = getCellIndex(event.layerX, event.layerY)

    if (!isWithinMatrix(world.worldData.worldMatrix, ...cellIndex)) {
        return
    }

    event.preventDefault()
    const cell = world.worldData.worldMatrix[cellIndex[0]][cellIndex[1]]

    if (event.altKey) {
        if (cell.block === null) {
            world.worldData.placeBlock(...cellIndex, new Water())
        }
    } else if (event.shiftKey) {
        if (cell.block === null) {
            world.worldData.placeBlock(...cellIndex, new Sand())
        }
    } else if (event.ctrlKey) {
        if (cell.wall !== null) {
            cell.wall = null
            cell.texture.update()
        }
    } else {
        if (cell.block !== null) {
            world.worldData.placeBlock(...cellIndex, null)
        }
    }
})

GUIRenderer.canvas.addEventListener('mousedown', event => {
    if (event.button === 1) {
        event.preventDefault()
        const cellIndex = getCellIndex(event.layerX, event.layerY)

        if (!isWithinMatrix(world.worldData.worldMatrix, ...cellIndex)) {
            return
        }

        const cell = world.worldData.worldMatrix[cellIndex[0]][cellIndex[1]]
        picked =
            event.ctrlKey
                ? cell.wall
                    ? cell.wall.constructor
                    : null
                : cell.block
                    ? cell.block.constructor
                    : null
    }
})

GUIRenderer.canvas.addEventListener('contextmenu', event => {
    const cellIndex = getCellIndex(event.layerX, event.layerY)
    
    if (!isWithinMatrix(world.worldData.worldMatrix, ...cellIndex)) {
        return
    }

    event.preventDefault()
    const cell = world.worldData.worldMatrix[cellIndex[0]][cellIndex[1]]

    if (event.ctrlKey) {
        if (cell.wall === null) {
            cell.wall = new picked()
            cell.texture.update()
        }
    } else {
        if (cell.block === null) {
            world.worldData.placeBlock(...cellIndex, new picked())
        }
    }
})

window.addEventListener('resize', () => {
    if (!camera.rendering.parameters.enabled) {
        return
    }
    
    const wrapper = document.querySelector('.canvas-wrapper')

    wrapper.style.width = innerWidth + 'px'
    wrapper.style.height = innerHeight - 1 + 'px'

    wrapper.childNodes.forEach(canvas => {
        canvas.width = innerWidth
        canvas.height = innerHeight
    })

    camera.rendering.parameters.zoom = camera.rendering.parameters.defaultZoom
    cameraStick.y = GUIRenderer.canvas.height - 120
})

window.world = world
window.camera = camera

progress.parentNode.style.display = 'none'

/*camera.position.moveBy(world.worldData.width * 8, world.worldData.height * 8)
camera.rendering.parameters.zoom = 0.5
await sleep(100)
camera.rendering.parameters.enabled = false*/