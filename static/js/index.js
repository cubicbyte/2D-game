import sleep from './sleep.js'
import World from './World.js'
import Camera from './Camera.js'
import Air from './blocks/Air.js'
import Dirt from './blocks/Dirt.js'
import Log from './blocks/Log.js'
import Leaves from './blocks/Leaves.js'
import Stone from './blocks/Stone.js'
import Grass from './blocks/Grass.js'
import IronOre from './blocks/IronOre.js'
import Cobblestone from './blocks/Cobblestone.js'
import Renderer from './Renderer.js'
import Control from './Control.js'
import Stick from './Stick.js'
import HZCounter from './HzCounter.js'
import { defaultWorld } from './worldGenerators.js'

const progress = document.querySelector('.loader progress')
const progressTitle = document.querySelector('.loader p')

function getCellIndex(x, y) {
    return {
        x: Math.floor(
            (
                x / camera.rendering.parameters.zoom
                + camera.position.x
                - Math.floor(
                    (GUIRenderer.canvas.width / 2)
                    / camera.rendering.parameters.zoom
                )
            ) / 16
        ),
        y: Math.floor(
            (
                y / camera.rendering.parameters.zoom
                + camera.position.y
                - Math.floor(
                    (GUIRenderer.canvas.height / 2)
                    / camera.rendering.parameters.zoom
                )
            ) / 16
        )
    }
}

let start = Date.now()
console.log('Генерация мира...')
progressTitle.innerText = 'Генерация мира...'

const world = new World({
    size: {
        width: 96,
        height: 48
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
    }
}))

console.log(`Генерация мира окончена. Время: ${Date.now() - start}мс`)

start = Date.now()
console.log('Компиляция текстур...')
progressTitle.innerText = 'Компиляция текстур...'

await Log.LoadTexture()
await Leaves.LoadTexture()
await Stone.LoadTexture()
await IronOre.LoadTexture()
await Cobblestone.LoadTexture()

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
    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = '#000000'
    ctx.fillText(`
    FPS: ${hzCounter.Hz}
    Zoom: ${camera.rendering.parameters.zoom}
    X: ${camera.position.x}
    Y: ${camera.position.y}
    `, 5, 15)

    cameraStick.draw(ctx)
    cameraStick.update()
    cameraControl.update()
    hzCounter.update()

    let texture = picked ? picked.texture.texture : new Image()
    ctx.drawImage(
        texture,
        0,
        0,
        texture.width,
        texture.height,
        width - texture.width * 4 - 16,
        height - texture.height * 4 - 16,
        texture.width * 4,
        texture.height * 4
    )
})

camera.rendering.addRenderer(worldRenderer)
camera.rendering.addRenderer(GUIRenderer)
camera.rendering.parameters.zoom = Number((Math.max(innerWidth, innerHeight) / 512).toFixed(2))
cameraStick.element = GUIRenderer.canvas
cameraStick.x = 120
cameraStick.y = GUIRenderer.canvas.height - 120

let picked = new Dirt()

GUIRenderer.canvas.addEventListener('click', event => {
    const cellIndex = getCellIndex(event.layerX, event.layerY)

    if (
        cellIndex.x >= world.worldData.width ||
        cellIndex.y >= world.worldData.height ||
        cellIndex.x < 0 ||
        cellIndex.y < 0
    ) {
        return
    }

    event.preventDefault()
    const cell = world.worldData.worldMatrix[cellIndex.x][cellIndex.y]

    if (cell.block !== null) {
        cell.block = null
        cell.texture.update()
    }
})

GUIRenderer.canvas.addEventListener('mousedown', event => {
    if (event.button === 1) {
        event.preventDefault()
        const cellIndex = getCellIndex(event.layerX, event.layerY)

        if (
            cellIndex.x >= world.worldData.width ||
            cellIndex.y >= world.worldData.height ||
            cellIndex.x < 0 ||
            cellIndex.y < 0
        ) {
            return
        }

        const cell = world.worldData.worldMatrix[cellIndex.x][cellIndex.y]
        picked = cell.block
    }
})

GUIRenderer.canvas.addEventListener('contextmenu', event => {
    const cellIndex = getCellIndex(event.layerX, event.layerY)
    
    if (
        cellIndex.x >= world.worldData.width ||
        cellIndex.y >= world.worldData.height ||
        cellIndex.x < 0 ||
        cellIndex.y < 0
    ) {
        return
    }

    event.preventDefault()
    const cell = world.worldData.worldMatrix[cellIndex.x][cellIndex.y]

    if (!cell.block) {
        cell.block = picked
        cell.texture.update()
    }
})

window.addEventListener('resize', () => {
    const wrapper = document.querySelector('.canvas-wrapper')

    wrapper.style.width = window.innerWidth + 'px'
    wrapper.style.height = window.innerHeight + 'px'

    wrapper.childNodes.forEach(canvas => {
        canvas.width = innerWidth
        canvas.height = innerHeight
    })

    camera.rendering.parameters.zoom = Number((Math.max(innerWidth, innerHeight) / 512).toFixed(2))
    cameraStick.y = GUIRenderer.canvas.height - 120
})

window.world = world
window.camera = camera

progress.parentNode.style.display = 'none'

/*camera.position.moveBy(world.worldData.width * 8, world.worldData.height * 8)
camera.rendering.parameters.zoom = 0.5
await sleep(100)
camera.rendering.parameters.enabled = false*/