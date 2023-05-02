import Engine from './engine.js'
import Block from './block.js'
import { WorldCell } from './World.js'

export function gravity(this: Block, { world, x, y }: BlockUpdateParameters): boolean {
    if (
        !this.properties.hasGravity
        || y + 1 >= world.worldData.height
        || world.worldData.getBlock(x, y + 1)
    ) {
        return false
    }

    if (!this.properties.falling) {
        this.properties.falling = true
        world.worldData.updateNearestBlocks(x, y)
    }
    
    if (y + 2 < world.worldData.height && world.worldData.getBlock(x, y + 2)) {
        this.properties.falling = false
        world.worldData.updateNearestBlocks(x, y + 2)
    }

    world.worldData.moveBlock(x, y, x, y + 1)
    return true
}

/**
 * 
 * TODO:
 * Решить этот костыль размещением блоков по ID
 * 
 */

export function liquid(thisBlock: Block, { world, x, y }: BlockUpdateParameters): boolean {
    if (
        y + 1 >= world.worldData.height
        || thisBlock.properties.level === undefined
        || thisBlock.properties.maxLevel === undefined
        || thisBlock.properties.minLevel === undefined
        || thisBlock.properties.levelStep === undefined
    ) {
        return false
    }
    
    if (thisBlock.properties.level === 0) {
        world.worldData.removeBlock(x, y)
        return true
    }

    const cellBelow = world.worldData.getCell(x, y + 1) as WorldCell

    if (!cellBelow.block || cellBelow.block.properties.level === undefined) {
        return false
    }

    if (cellBelow.block.properties.level < thisBlock.properties.maxLevel) {
        const level = cellBelow.block.properties.level + thisBlock.properties.level - 1000
        if (level < 0) {
            cellBelow.block.properties.level += thisBlock.properties.level
            world.worldData.removeBlock(x, y)
            return true
        }

        cellBelow.block.properties.level = 1000
        thisBlock.properties.level = level
    }

    if (thisBlock.properties.level === thisBlock.properties.levelStep) {
        return false
    }

    function updateNearestWaterBlocks() {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    i < 0 ||
                    j < 0 ||
                    i >= world.worldData.width ||
                    j >= world.worldData.height ||
                    (i === x && j === x)
                ) {
                    continue
                }

                const block = world.worldData.getBlock(i, j)

                if (
                    !block ||
                    !(block)
                ) {
                    continue
                }

                world.worldData.updateCell(i, j)
            }
        }
    }

    const leftBlock = x - 1 < 0 ? null : world.worldData.getBlock(x - 1, y)
    const rightBlock = x + 1 >= world.worldData.width ? null : world.worldData.getBlock(x + 1, y)

    if (
        (
            leftBlock === null
            || (
                leftBlock.properties.level === undefined
                && (leftBlock.properties.level || 0) + thisBlock.properties.levelStep < (thisBlock.properties.level || 0)
            )
        ) && (
            rightBlock === null
            || (
                rightBlock.properties.level === undefined
                && (rightBlock.properties.level || 0) + thisBlock.properties.levelStep < (thisBlock.properties.level || 0)
            )
        )
    ) {
        let leftWaterLevel = leftBlock === null ? 0 : leftBlock.properties.level as number
        let rightWaterLevel = rightBlock === null ? 0 : rightBlock.properties.level as number
        let waterLevel = thisBlock.properties.level
        
        const levelSum = (leftWaterLevel + waterLevel + rightWaterLevel)
        const avgLevel = levelSum / 3

        leftWaterLevel = avgLevel
        rightWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (thisBlock.properties.levelStep * 3) >= thisBlock.properties.levelStep) {
            waterLevel += thisBlock.properties.levelStep
        }

        if (levelSum % (thisBlock.properties.levelStep * 3) === (thisBlock.properties.levelStep * 2)) {
            if (Math.random() < 0.5) {
                leftWaterLevel += thisBlock.properties.levelStep
            } else {
                rightWaterLevel += thisBlock.properties.levelStep
            }
        }

        let leftWater = leftBlock
        let rightWater = rightBlock
        const thisBlockClass = Engine.getBlockById(thisBlock.id) as PublicConstructor<Block>

        if (leftBlock === null) {
            leftWater = new thisBlockClass(leftWaterLevel)
            world.worldData.setBlock(x - 1, y, leftWater)
        } else {
            leftBlock.properties.level = leftWaterLevel
        }

        if (rightBlock === null) {
            rightWater = new thisBlockClass(rightWaterLevel)
            world.worldData.setBlock(x + 1, y, rightWater)
        } else {
            rightBlock.properties.level = rightWaterLevel
        }

        thisBlock.properties.level = waterLevel
        updateNearestWaterBlocks()

        return true
    }

    if (
        leftBlock === null
        || (
            leftBlock.properties.level === undefined
            && leftBlock.properties.level || 0 + thisBlock.properties.levelStep < (thisBlock.properties.level || 0)
        )
    ) {
        let leftWaterLevel = leftBlock === null ? 0 : leftBlock.properties.level as number
        let waterLevel = thisBlock.properties.level
        
        const levelSum = (leftWaterLevel + waterLevel)
        const avgLevel = levelSum / 2

        leftWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (thisBlock.properties.levelStep * 2) === thisBlock.properties.levelStep) {
            waterLevel += thisBlock.properties.levelStep
        }

        let leftWater = leftBlock
        const thisBlockClass = Engine.getBlockById(thisBlock.id) as PublicConstructor<Block>

        if (leftBlock === null) {
            leftWater = new thisBlockClass(leftWaterLevel)
            world.worldData.setBlock(x - 1, y, leftWater)
        } else {
            leftBlock.properties.level = leftWaterLevel
        }

        thisBlock.properties.level = waterLevel
        updateNearestWaterBlocks()

        return true
    }

    if (
        rightBlock === null
        || (
            rightBlock.properties.level === undefined
            && rightBlock.properties.level || 0 + thisBlock.properties.levelStep < (thisBlock.properties.level || 0)
        )
    ) {
        let rightWaterLevel = rightBlock === null ? 0 : rightBlock.properties.level as number
        let waterLevel = thisBlock.properties.level
        
        const levelSum = (rightWaterLevel + waterLevel)
        const avgLevel = levelSum / 2

        rightWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (thisBlock.properties.levelStep * 2) === thisBlock.properties.levelStep) {
            waterLevel += thisBlock.properties.levelStep
        }

        let rightWater = rightBlock
        const thisBlockClass = Engine.getBlockById(thisBlock.id) as PublicConstructor<Block>

        if (rightBlock === null) {
            rightWater = new thisBlockClass(rightWaterLevel)
            world.worldData.setBlock(x + 1, y, rightWater)
        } else {
            rightBlock.properties.level = rightWaterLevel
        }

        thisBlock.properties.level = waterLevel
        updateNearestWaterBlocks()

        return true
    }

    return false
}