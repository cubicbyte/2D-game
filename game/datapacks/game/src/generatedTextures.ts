import Air from './blocks/Air.js'
import Dirt from './blocks/Dirt.js'
import Grass from './blocks/Grass.js'
import Water from './blocks/Water.js'
import random from '/game/js/utils/random.js'
import { GeneratedTexture } from '/game/js/Texture.js'

const textures: Map<string, GeneratedTexture> = new Map()


export const airTexture = new GeneratedTexture(({ setBackground }) => {
    setBackground(Air.color)
})


export const dirtTexture = new GeneratedTexture(({ ctx, canvas, setBackground }) => {
    setBackground(Dirt.color)

    function fillRandomPixel(color: string) {
        ctx.fillStyle = color
        ctx.fillRect(
            random(canvas.width),
            random(canvas.height),
            1,
            1
        )
    }

    for (let i = 0; i < canvas.width * 6; i++) {
        fillRandomPixel('#593d21')
    }

    for (let i = 0; i < canvas.width * 4; i++) {
        fillRandomPixel('#47301a')
    }

    for (let i = 0; i < canvas.width * 2; i++) {
        fillRandomPixel('#7e5530')
    }

    for (let i = 0; i < canvas.width / 4; i++) {
        fillRandomPixel('#646973')
    }
})


export const grassTexture = new GeneratedTexture(({ ctx, canvas }) => {
    const pixelColors = [
        '#00b300',
        '#008811',
        '#008800',
        '#009911',
        '#008000'
    ]

    ctx.drawImage(dirtTexture.image, 0, 0)

    ctx.fillStyle = Grass.color
    ctx.fillRect(0, 0, canvas.width, Math.floor(canvas.height / 4))

    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height / 4; j++) {
            const randomPixelColorIndex = random(pixelColors.length)
            const randomPixelColor = pixelColors[randomPixelColorIndex]

            ctx.fillStyle = randomPixelColor
            ctx.fillRect(i, j, 1, 1)
        }
    }
})


export const waterTexture = new GeneratedTexture(({ setBackground }) => {
    setBackground(Water.color)
})


textures.set('game:air', airTexture)
textures.set('game:dirt', dirtTexture)
textures.set('game:grass', grassTexture)
textures.set('game:water', waterTexture)


export default textures