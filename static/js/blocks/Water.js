import { isPositiveInteger, validateIntegerRange } from '../dataValidator.js'
import convertObject from '../convertObject.js'
import Block from '../Block.js'
import Texture from '../Texture.js'

export default class Water extends Block {
    static #MIN_LEVEL = 0
    static #MAX_LEVEL = 1000
    static #LEVEL_STEP = 100

    static #update(type, worldData, x, y) {
        if (
            type !== 'block' ||
            y + 1 >= worldData.height
        ) {
            return false
        }

        const cellBelow = worldData.worldMatrix[x][y + 1]

        if (!cellBelow.block) {
            return false
        }

        if (cellBelow.block instanceof Water) {
            if (cellBelow.block.properties.level < Water.MAX_LEVEL) {
                const level = cellBelow.block.properties.level + this.properties.level - 1000
                if (level > 0) {
                    cellBelow.block.properties.level = 1000
                    this.properties.level = level
                    this.texture.update()
                } else {
                    cellBelow.block.properties.level += this.properties.level
                    worldData.removeBlock(x, y)
                }

                cellBelow.block.texture.update()
                cellBelow.texture.update()
                
                return true
            }
        }

        if (this.properties.level === Water.LEVEL_STEP) {
            return false
        }
        
        const leftBlock = x - 1 < 0 || worldData.worldMatrix[x - 1][y].block
        const rightBlock = x + 1 >= worldData.width || worldData.worldMatrix[x + 1][y].block

        if ((leftBlock === null || (leftBlock instanceof Water && leftBlock.properties.level < this.properties.level)) && (rightBlock === null || (rightBlock instanceof Water && rightBlock.properties.level < this.properties.level))) {
            let leftWaterLevel = leftBlock === null ? 0 : leftBlock.properties.level
            let rightWaterLevel = rightBlock === null ? 0 : rightBlock.properties.level
            let waterLevel = this.properties.level
            
            const levelSum = (leftWaterLevel + waterLevel + rightWaterLevel)
            const avgLevel = levelSum / 3

            leftWaterLevel = avgLevel
            rightWaterLevel = avgLevel
            waterLevel = avgLevel

            if (levelSum % (Water.LEVEL_STEP * 3) >= Water.LEVEL_STEP) {
                waterLevel += Water.LEVEL_STEP
            }

            if (levelSum % (Water.LEVEL_STEP * 3) === (Water.LEVEL_STEP * 2)) {
                if (Math.random() < 0.5) {
                    leftWaterLevel += Water.LEVEL_STEP
                } else {
                    rightWaterLevel += Water.LEVEL_STEP
                }
            }

            let leftWater = leftBlock
            let rightWater = rightBlock

            if (leftBlock === null) {
                leftWater = new Water(leftWaterLevel)
                worldData.placeBlock(x - 1, y, leftWater)
            } else {
                leftBlock.properties.level = leftWaterLevel
                leftBlock.texture.update()
            }

            if (rightBlock === null) {
                rightWater = new Water(rightWaterLevel)
                worldData.placeBlock(x + 1, y, rightWater)
            } else {
                rightBlock.properties.level = rightWaterLevel
                rightBlock.texture.update()
            }

            this.properties.level = waterLevel
            this.texture.update()
            
            worldData.worldMatrix[x - 1][y].texture.update()
            worldData.worldMatrix[x + 1][y].texture.update()

            worldData.updateCell(x - 1, y)
            worldData.updateCell(x + 1, y)
            
            return true
        }
    }

    static #DEFAULT_TEXTURE = new Texture().create(function(ctx, canvas, params) {
        if (!isPositiveInteger(params.size)) {
            params.size = 16
        }

        this.setSize(params.size)
        this.setBackground('#4444ee')
    })

    #texture
    #properties = convertObject({
        _hasGravity: true,
        _level: value => {
            value -= value % Water.LEVEL_STEP
            validateIntegerRange(value, Water.#MIN_LEVEL, Water.#MAX_LEVEL, 'Water level')
            return value
        }
    })

    constructor(level = Water.#MAX_LEVEL) {
        function removeEmpty(type, worldData, x, y) {
            if (type !== 'block') {
                return false
            }
            
            if (this.properties.level === 0) {
                worldData.removeBlock(x, y)
                return true
            }
        }

        super([removeEmpty, Water.#update])
        this.#properties.level = 200

        this.#texture = new Texture().create((ctx, canvas, params) => {
            if (!isPositiveInteger(params.size)) {
                params.size = 16
            }
            
            canvas.width = params.size
            canvas.height = params.size

            const levelK = Math.floor(params.size * (this.properties.level / Water.MAX_LEVEL))

            ctx.fillStyle = '#4444ee'
            ctx.fillRect(0, params.size - levelK, params.size, levelK)
        })
    }

    get texture() { return this.#texture }
    get properties() { return this.#properties }
    
    static get texture() { return this.#DEFAULT_TEXTURE }
    static get MIN_LEVEL() { return this.#MIN_LEVEL }
    static get MAX_LEVEL() { return this.#MAX_LEVEL }
    static get LEVEL_STEP() { return this.#LEVEL_STEP }
}