import Block from './block.js'
import Water from './blocks/Water.js'

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

export function liquid(this: Block, { world, x, y }: BlockUpdateParameters): boolean {
    if (
        y + 1 >= world.worldData.height
        || this.properties.maxLevel === undefined
        || this.properties.minLevel === undefined
        || this.properties.levelStep === undefined
    ) {
        return false
    }
    
    if (this.properties.level === 0) {
        world.worldData.removeBlock(x, y)
        return true
    }

    const cellBelow = world.worldData.getCell(x, y + 1)

    if (!cellBelow.block) {
        return false
    }

    if (cellBelow.block instanceof Water) {
        if (cellBelow.block.properties.level < this.properties.maxLevel) {
            const level = cellBelow.block.properties.level + this.properties.level - 1000
            if (level < 0) {
                cellBelow.block.properties.level += this.properties.level
                world.worldData.removeBlock(x, y)
                return true
            }

            cellBelow.block.properties.level = 1000
            this.properties.level = level
        }
    }

    if (this.properties.level === this.properties.levelStep) {
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
    
    const leftBlock = x - 1 < 0 || world.worldData.getBlock(x - 1, y)
    const rightBlock = x + 1 >= world.worldData.width || world.worldData.getBlock(x + 1, y)

    if (
        (
            leftBlock === null
            || (
                leftBlock instanceof Water
                && (leftBlock.properties.level || 0) + this.properties.levelStep < (this.properties.level || 0)
            )
        ) && (
            rightBlock === null
            || (
                rightBlock instanceof Water
                && (rightBlock.properties.level || 0) + this.properties.levelStep < (this.properties.level || 0)
            )
        )
    ) {
        let leftWaterLevel = leftBlock === null ? 0 : leftBlock.properties.level
        let rightWaterLevel = rightBlock === null ? 0 : rightBlock.properties.level
        let waterLevel = this.properties.level
        
        const levelSum = (leftWaterLevel + waterLevel + rightWaterLevel)
        const avgLevel = levelSum / 3

        leftWaterLevel = avgLevel
        rightWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (this.properties.levelStep * 3) >= this.properties.levelStep) {
            waterLevel += this.properties.levelStep
        }

        if (levelSum % (this.properties.levelStep * 3) === (this.properties.levelStep * 2)) {
            if (Math.random() < 0.5) {
                leftWaterLevel += this.properties.levelStep
            } else {
                rightWaterLevel += this.properties.levelStep
            }
        }

        let leftWater = leftBlock
        let rightWater = rightBlock

        if (leftBlock === null) {
            leftWater = new Water(leftWaterLevel)
            world.worldData.setBlock(x - 1, y, leftWater)
        } else {
            leftBlock.properties.level = leftWaterLevel
        }

        if (rightBlock === null) {
            rightWater = new Water(rightWaterLevel)
            world.worldData.setBlock(x + 1, y, rightWater)
        } else {
            rightBlock.properties.level = rightWaterLevel
        }

        this.properties.level = waterLevel
        updateNearestWaterBlocks()

        return true
    }

    if (
        leftBlock === null
        || (
            leftBlock instanceof Water
            && leftBlock.properties.level || 0 + this.properties.levelStep < (this.properties.level || 0)
        )
    ) {
        let leftWaterLevel = leftBlock === null ? 0 : leftBlock.properties.level
        let waterLevel = this.properties.level
        
        const levelSum = (leftWaterLevel + waterLevel)
        const avgLevel = levelSum / 2

        leftWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (this.properties.levelStep * 2) === this.properties.levelStep) {
            waterLevel += this.properties.levelStep
        }

        let leftWater = leftBlock

        if (leftBlock === null) {
            leftWater = new Water(leftWaterLevel)
            world.worldData.setBlock(x - 1, y, leftWater)
        } else {
            leftBlock.properties.level = leftWaterLevel
        }

        this.properties.level = waterLevel
        updateNearestWaterBlocks()

        return true
    }

    if (
        rightBlock === null
        || (
            rightBlock instanceof Water
            && rightBlock.properties.level || 0 + this.properties.levelStep < (this.properties.level || 0)
        )
    ) {
        let rightWaterLevel = rightBlock === null ? 0 : rightBlock.properties.level
        let waterLevel = this.properties.level
        
        const levelSum = (rightWaterLevel + waterLevel)
        const avgLevel = levelSum / 2

        rightWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (this.properties.levelStep * 2) === this.properties.levelStep) {
            waterLevel += this.properties.levelStep
        }

        let rightWater = rightBlock

        if (rightBlock === null) {
            rightWater = new Water(rightWaterLevel)
            world.worldData.setBlock(x + 1, y, rightWater)
        } else {
            rightBlock.properties.level = rightWaterLevel
        }

        this.properties.level = waterLevel
        updateNearestWaterBlocks()

        return true
    }

    return false
}