import { isInstance, validateFunction, validateInteger, validateObject } from './dataValidator.js'
import PerlinNoise from './PerlinNoise.js'
import WorldCell from './WorldCell.js'
import Air from './blocks/Air.js'
import Dirt from './blocks/Dirt.js'
import Grass from './blocks/Grass.js'
import Leaves from './blocks/Leaves.js'
import Stone from './blocks/Stone.js'
import random from './random.js'
import Log from './blocks/Log.js'
import Cobblestone from './blocks/Cobblestone.js'
import IronOre from './blocks/IronOre.js'
import Bedrock from './blocks/Bedrock.js'

export function defaultWorld(params = {}) {
    validateObject(params, 'World generator parameters')

    if (!params.onprogress) {
        params.onprogress = function() {}
    }

    if (typeof params.groundAltitudeOffset !== 'number') {
        params.groundAltitudeOffset = 0
    }
    
    validateFunction(params.onprogress, 'onprogress callback')
    validateInteger(params.groundAltitudeOffset, 'Ground altitude offset')
    
    return async function(width, height) {
        let worldMatrix = []

        function alt(i) {
            return Math.floor(
                Math.sin(i / 16) * 4 +
                Math.sin(i / 8) * 2 +
                Math.sin(i / 6) * 2
            )
        }

        function generateCell(i, j) {
            const cell = new WorldCell

            cell.background = new Air

            if (i === 0 || j === 0 || i === width - 1 || j === height - 1) {
                cell.block = new Bedrock
                return cell
            }

            const res = alt(i) + height / 2 + params.groundAltitudeOffset

            if (j > res) {
                let block
                let wall = null
                
                if (j - 3 > res) {
                    block = new Stone
                    wall = new Cobblestone
                } else {
                    block = new Dirt
                    wall = new Dirt
                }

                cell.block = block
                cell.wall = wall
            } else if (j === res) {
                cell.block = new Grass
                cell.wall = new Dirt
            }

            return cell
        }

        function getCaves(worldMatrix, groundLevel) {
            let caves = []

            function caveRegistered(x, y) {
                for (const cave of caves) {
                    if (cave.includes(`${x},${y}`)) {
                        return true
                    }
                }

                return false
            }

            function getCave(x, y, caveArray = []) {
                if (x >= width || x < 0 || y < 0 || y >= height) {
                    return caveArray
                }
                const cell = worldMatrix[x][y]
                if (cell.block || caveArray.includes(`${x},${y}`)) {
                    return caveArray
                }

                caveArray.push(`${x},${y}`)
                caveArray = getCave(x, y - 1, caveArray)
                caveArray = getCave(x, y + 1, caveArray)
                caveArray = getCave(x - 1, y, caveArray)
                caveArray = getCave(x + 1, y, caveArray)

                return caveArray
            }

            for (let x = 0; x < worldMatrix.length; x++) {
                for (let y = groundLevel[x]; y < worldMatrix[x].length; y++) {
                    const cell = worldMatrix[x][y]
                    if (!cell.block && !caveRegistered(x, y)) {
                        caves.push(getCave(x, y))
                    }
                }
            }

            return caves.map(
                cave => cave.map(
                    coordinates => coordinates.split(',').map(Number)
                )
            )
        }

        for (let i = 0; i < width; i++) {
            worldMatrix[i] = []
            for (let j = 0; j < height; j++) {
                worldMatrix[i][j] = generateCell(i, j)
            }
            await params.onprogress((i + 1) / width)
        }

        const getGroundLevel = x => {
            const check = y => {
                if (y >= height) {
                    return height - 1
                }

                const cell = worldMatrix[x][y]

                if (isInstance(cell.block, Grass)) {
                    return y
                }

                return check(y + 1)
            }

            return check(0)
        }

        const getCaveGroundLevels = (x, fromY) => {
            let groundLevels = []

            const check = y => {
                if (y >= height) {
                    return
                }

                const cellAbove = worldMatrix[x][y - 1]
                const cell = worldMatrix[x][y]

                if (cell.block && !cellAbove.block) {
                    groundLevels.push(y)
                }

                return check(y + 1)
            }

            check(fromY)
            return groundLevels
        }

        const createTree = (x, y) => {
            for (let j = y - 4; j < y; j++) {
                if (
                    x <= 0 ||
                    x >= width - 1 ||
                    j <= 0 ||
                    j >= height - 1
                ) {
                    continue
                }

                worldMatrix[x][j].block = new Log
            }

            for (let i = x - 2; i < x + 3; i++) {
                for (let j = y - 4; j < y - 2; j++) {
                    if (
                        i <= 0 ||
                        i >= width - 1 ||
                        j <= 0 ||
                        j >= height - 1 ||
                        i === x
                    ) {
                        continue
                    }

                    worldMatrix[i][j].block = new Leaves
                }
            }

            for (let i = x - 1; i < x + 2; i++) {
                for (let j = y - 6; j < y - 4; j++) {
                    if (
                        i <= 0 ||
                        i >= width - 1 ||
                        j <= 0 ||
                        j >= height - 1
                    ) {
                        continue
                    }

                    worldMatrix[i][j].block = new Leaves
                }
            }

            if (y < height && isInstance(worldMatrix[x][y].block, Grass)) {
                worldMatrix[x][y].block = new Dirt
            }
        }

        
        let groundLevel = []
        for (let i = 1; i < width - 1; i++) {
            groundLevel[i] = getGroundLevel(i)
        }

        PerlinNoise.seed(Math.random())
        for (let x = 1; x < width - 1; x++) {
            for (let y = groundLevel[x] + 4; y < height - 1; y++) {
                if (PerlinNoise.simplex2(x / 8, (y + height) / 8) > 0.6) {
                    worldMatrix[x][y].block = new IronOre
                }
            }
        }
        
        for (let x = 1; x < width - 1; x++) {
            for (let y = groundLevel[x]; y < height - 1; y++) {
                if (PerlinNoise.simplex2(x / 8, y / 8) > 0 && y - 2 > groundLevel[x] + Math.abs(Math.sin(x / 4) * 6)) {
                    worldMatrix[x][y].block = null
                }
            }
        }

        for (const cave of getCaves(worldMatrix, groundLevel)) {
            if (cave.length < 8) {
                cave.forEach(coordinates => {
                    worldMatrix[coordinates[0]][coordinates[1]].block = new Stone
                })
            }
        }

        let caveGroundLevels = []
        for (let i = 1; i < width - 1; i++) {
            caveGroundLevels[i] = getCaveGroundLevels(i, groundLevel[i] + 1)
            for (const y of caveGroundLevels[i]) {
                if (y + 2 < height && worldMatrix[i][y + 1].block) {
                    worldMatrix[i][y].block = new Dirt
                }
            }
        }
        
        let lastTreeXCoordinate = 0
        for (let i = 0; i < width; i++) {
            const generateTree = random(8) === 0

            if (generateTree) {
                if (i - lastTreeXCoordinate > 2) {
                    createTree(i, groundLevel[i])
                    lastTreeXCoordinate = i
                }
            }
        }

        return worldMatrix
    }
}