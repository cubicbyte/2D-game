export function gravity(type, worldData, x, y) {
    if (type !== 'block' || !this.properties.hasGravity || y + 1 >= worldData.height) {
        return false
    }

    if (!worldData.worldMatrix[x][y + 1].block) {
        if (!this.properties.falling) {
            this.properties.falling = true
            worldData.updateNearestBlocks(x, y)
        }
        
        if (y + 2 < worldData.height && worldData.worldMatrix[x][y + 2].block) {
            this.properties.falling = false
            worldData.updateNearestBlocks(x, y + 2)
        }

        worldData.moveBlock(x, y, x, y + 1)
    }
}

export function liquid(type, worldData, x, y) {
    if (
        type !== 'block' ||
        y + 1 >= worldData.height
    ) {
        return
    }
    
    if (this.properties.level === 0) {
        worldData.removeBlock(x, y)
        return
    }

    const cellBelow = worldData.worldMatrix[x][y + 1]

    if (!cellBelow.block) {
        return
    }

    if (cellBelow.block instanceof this.constructor) {
        if (cellBelow.block.properties.level < this.constructor.MAX_LEVEL) {
            const level = cellBelow.block.properties.level + this.properties.level - 1000
            if (level < 0) {
                cellBelow.block.properties.level += this.properties.level
                worldData.removeBlock(x, y)
                return
            }

            cellBelow.block.properties.level = 1000
            this.properties.level = level
        }
    }

    if (this.properties.level === this.constructor.LEVEL_STEP) {
        return
    }

    function updateNearestWaterBlocks() {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    i < 0 ||
                    j < 0 ||
                    i >= worldData.width ||
                    j >= worldData.height ||
                    (i === x && j === x)
                ) {
                    continue
                }

                const block = worldData.worldMatrix[i][j].block

                if (
                    !block ||
                    block.constructor !== this.constructor
                ) {
                    continue
                }

                worldData.updateCell(i, j)
            }
        }
    }
    
    const leftBlock = x - 1 < 0 || worldData.worldMatrix[x - 1][y].block
    const rightBlock = x + 1 >= worldData.width || worldData.worldMatrix[x + 1][y].block

    if (
        (
            leftBlock === null
            || (
                leftBlock instanceof this.constructor
                && leftBlock.properties.level + this.constructor.LEVEL_STEP < this.properties.level
            )
        ) && (
            rightBlock === null
            || (
                rightBlock instanceof this.constructor
                && rightBlock.properties.level + this.constructor.LEVEL_STEP < this.properties.level
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

        if (levelSum % (this.constructor.LEVEL_STEP * 3) >= this.constructor.LEVEL_STEP) {
            waterLevel += this.constructor.LEVEL_STEP
        }

        if (levelSum % (this.constructor.LEVEL_STEP * 3) === (this.constructor.LEVEL_STEP * 2)) {
            if (Math.random() < 0.5) {
                leftWaterLevel += this.constructor.LEVEL_STEP
            } else {
                rightWaterLevel += this.constructor.LEVEL_STEP
            }
        }

        let leftWater = leftBlock
        let rightWater = rightBlock

        if (leftBlock === null) {
            leftWater = new this.constructor(leftWaterLevel)
            worldData.placeBlock(x - 1, y, leftWater)
        } else {
            leftBlock.properties.level = leftWaterLevel
        }

        if (rightBlock === null) {
            rightWater = new this.constructor(rightWaterLevel)
            worldData.placeBlock(x + 1, y, rightWater)
        } else {
            rightBlock.properties.level = rightWaterLevel
        }

        this.properties.level = waterLevel
        updateNearestWaterBlocks()
        
        return
    }

    if (
        leftBlock === null
        || (
            leftBlock instanceof this.constructor
            && leftBlock.properties.level + this.constructor.LEVEL_STEP < this.properties.level
        )
    ) {
        let leftWaterLevel = leftBlock === null ? 0 : leftBlock.properties.level
        let waterLevel = this.properties.level
        
        const levelSum = (leftWaterLevel + waterLevel)
        const avgLevel = levelSum / 2

        leftWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (this.constructor.LEVEL_STEP * 2) === this.constructor.LEVEL_STEP) {
            waterLevel += this.constructor.LEVEL_STEP
        }

        let leftWater = leftBlock

        if (leftBlock === null) {
            leftWater = new this.constructor(leftWaterLevel)
            worldData.placeBlock(x - 1, y, leftWater)
        } else {
            leftBlock.properties.level = leftWaterLevel
        }

        this.properties.level = waterLevel
        updateNearestWaterBlocks()
        
        return
    }

    if (
        rightBlock === null
        || (
            rightBlock instanceof this.constructor
            && rightBlock.properties.level + this.constructor.LEVEL_STEP < this.properties.level
        )
    ) {
        let rightWaterLevel = rightBlock === null ? 0 : rightBlock.properties.level
        let waterLevel = this.properties.level
        
        const levelSum = (rightWaterLevel + waterLevel)
        const avgLevel = levelSum / 2

        rightWaterLevel = avgLevel
        waterLevel = avgLevel

        if (levelSum % (this.constructor.LEVEL_STEP * 2) === this.constructor.LEVEL_STEP) {
            waterLevel += this.constructor.LEVEL_STEP
        }

        let rightWater = rightBlock

        if (rightBlock === null) {
            rightWater = new this.constructor(rightWaterLevel)
            worldData.placeBlock(x + 1, y, rightWater)
        } else {
            rightBlock.properties.level = rightWaterLevel
        }

        this.properties.level = waterLevel
        updateNearestWaterBlocks()
    }
}