import PerlinNoise from './utils/PerlinNoise.js'
import WorldCell from './WorldCell.js'
import Air from './blocks/Air.js'
import Dirt from './blocks/Dirt.js'
import Grass from './blocks/Grass.js'
import Leaves from './blocks/Leaves.js'
import Stone from './blocks/Stone.js'
import random from './utils/random.js'
import Log from './blocks/Log.js'
import Cobblestone from './blocks/Cobblestone.js'
import IronOre from './blocks/IronOre.js'
import Bedrock from './blocks/Bedrock.js'

export namespace DefaultWorld {
    export namespace Generator {
        
        export function create(params: DefaultWorldGeneratorParameters = {}) {
            return async function(width: number, height: number) {
                const worldMatrix: WorldMatrix = []
                const utilsParams = {
                    width,
                    height,
                    worldMatrix,
                    params: {
                        onprogress: params.onprogress || async function() {},
                        groundAltitudeOffset: params.groundAltitudeOffset ?? 0
                    }
                }
    
                for (let i = 0; i < width; i++) {
                    worldMatrix[i] = []
    
                    for (let j = 0; j < height; j++) {
                        worldMatrix[i][j] = Utils.generateCell(i, j, utilsParams)
                    }
    
                    await utilsParams.params.onprogress((i + 1) / width)
                }
            
                let groundLevel: number[] = []
                for (let i = 1; i < width - 1; i++) {
                    groundLevel[i] = Utils.getGroundLevel(i, utilsParams)
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
        
                for (const cave of Utils.getCaves(utilsParams, groundLevel)) {
                    if (cave.length < 8) {
                        cave.forEach(coordinates => {
                            worldMatrix[coordinates[0]][coordinates[1]].block = new Stone
                        })
                    }
                }
        
                let caveGroundLevels = []
                for (let i = 1; i < width - 1; i++) {
                    caveGroundLevels[i] = Utils.getCaveGroundLevels(i, groundLevel[i] + 1, utilsParams)
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
                            Utils.createTree(i, groundLevel[i], utilsParams)
                            lastTreeXCoordinate = i
                        }
                    }
                }
        
                return worldMatrix
            }
        }
        
        namespace Utils {
            export interface UtilsParameters {
                width: number
                height: number
                worldMatrix: WorldMatrix
                params: {
                    onprogress(done: number): Promise<void>
                    groundAltitudeOffset: number
                }
            }
            
            export function alt(i: number) {
                return Math.floor(
                    Math.sin(i / 16) * 4 +
                    Math.sin(i / 8) * 2 +
                    Math.sin(i / 6) * 2
                )
            }
    
            export function generateCell(i: number, j: number, params: UtilsParameters) {
                const cell = new WorldCell()
    
                cell.background = new Air()
    
                if (i === 0 || j === 0 || i === params.width - 1 || j === params.height - 1) {
                    cell.block = new Bedrock()
                    return cell
                }
    
                const res = alt(i) + params.height / 2 + params.params.groundAltitudeOffset
    
                if (j > res) {
                    let block
                    let wall = null
                    
                    if (j - 3 > res) {
                        block = new Stone()
                        wall = new Cobblestone()
                    } else {
                        block = new Dirt()
                        wall = new Dirt()
                    }
    
                    cell.block = block
                    cell.wall = wall
                } else if (j === res) {
                    cell.block = new Grass()
                    cell.wall = new Dirt()
                }
    
                return cell
            }
    
            export function isCaveRegistered(x: number, y: number, caves: string[][]) {
                for (const cave of caves) {
                    if (cave.includes(`${x},${y}`)) {
                        return true
                    }
                }
    
                return false
            }
    
            export function getCave(x: number, y: number, params: UtilsParameters, caveArray: string[] = []): string[] {
                if (x >= params.width || x < 0 || y < 0 || y >= params.height) {
                    return caveArray
                }
    
                const cell = params.worldMatrix[x][y]
    
                if (cell.block || caveArray.includes(`${x},${y}`)) {
                    return caveArray
                }
    
                caveArray.push(`${x},${y}`)
                caveArray = getCave(x, y - 1, params, caveArray)
                caveArray = getCave(x, y + 1, params, caveArray)
                caveArray = getCave(x - 1, y, params, caveArray)
                caveArray = getCave(x + 1, y, params, caveArray)
    
                return caveArray
            }
    
            export function getCaves(params: UtilsParameters, groundLevel: number[]) {
                const caves: string[][] = []
    
                for (let x = 0; x < params.worldMatrix.length; x++) {
                    for (let y = groundLevel[x]; y < params.worldMatrix[x].length; y++) {
                        const cell = params.worldMatrix[x][y]

                        if (!cell.block && !isCaveRegistered(x, y, caves)) {
                            caves.push(getCave(x, y, params))
                        }
                    }
                }
    
                return caves.map(
                    cave => cave.map(
                        coordinates => coordinates.split(',').map(Number)
                    )
                )
            }
    
            export function getGroundLevel(x: number, params: UtilsParameters): number {
                const check = (y: number): number => {
                    if (y >= params.height) {
                        return params.height - 1
                    }
    
                    const cell = params.worldMatrix[x][y]
    
                    if (cell.block instanceof Grass) {
                        return y
                    }
    
                    return check(y + 1)
                }
    
                return check(0)
            }
    
            export function getCaveGroundLevels(x: number, fromY: number, params: UtilsParameters): number[] {
                function check(y: number, groundLevels: number[] = []): number[] {
                    if (y >= params.height) {
                        return groundLevels
                    }
    
                    const cellAbove = params.worldMatrix[x][y - 1]
                    const cell = params.worldMatrix[x][y]
    
                    if (cell.block && !cellAbove.block) {
                        groundLevels.push(y)
                    }
    
                    return check(y + 1)
                }
    
                return check(fromY)
            }
    
            export function createTree(x: number, y: number, params: UtilsParameters) {
                for (let j = y - 4; j < y; j++) {
                    if (
                        x <= 0 ||
                        x >= params.width - 1 ||
                        j <= 0 ||
                        j >= params.height - 1
                    ) {
                        continue
                    }
    
                    params.worldMatrix[x][j].block = new Log()
                }
    
                for (let i = x - 2; i < x + 3; i++) {
                    for (let j = y - 4; j < y - 2; j++) {
                        if (
                            i <= 0 ||
                            i >= params.width - 1 ||
                            j <= 0 ||
                            j >= params.height - 1 ||
                            i === x
                        ) {
                            continue
                        }
    
                        params.worldMatrix[i][j].block = new Leaves()
                    }
                }
    
                for (let i = x - 1; i < x + 2; i++) {
                    for (let j = y - 6; j < y - 4; j++) {
                        if (
                            i <= 0 ||
                            i >= params.width - 1 ||
                            j <= 0 ||
                            j >= params.height - 1
                        ) {
                            continue
                        }
    
                        params.worldMatrix[i][j].block = new Leaves()
                    }
                }
    
                if (y < params.height && params.worldMatrix[x][y].block instanceof Grass) {
                    params.worldMatrix[x][y].block = new Dirt()
                }
            }
        }
    }
}