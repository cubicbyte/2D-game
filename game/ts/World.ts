import Block from './block.js'
import WorldUpdate from './worldUpdate.js'
import isWithinMatrix from './utils/isWithinMatrix.js'
import { GeneratedTexture } from './Texture.js'

export default class World {
    worldData: WorldData = new WorldData(this)

    async updateTextures(params: WorldTextureUpdateParameters = {}) {
        if (!params.onprogress) {
            params.onprogress = async function() {}
        }

        for (let i = 0; i < this.worldData.width; i++) {
            for (let j = 0; j < this.worldData.height; j++) {
                this.worldData.getCell(i, j)?.texture.update()
            }

            await params.onprogress((i + 1) / this.worldData.width)
        }
    }
}

export class WorldData {
    private _worldMatrix: WorldMatrix | null = null

    constructor (private _world: World) {}

    getCell(x: number, y: number): WorldCell | null {
        if (!this._worldMatrix || !isWithinMatrix(this._worldMatrix, x, y)) {
            return null
        }

        return this._worldMatrix[x][y]
    }

    private _setCellLayer(x: number, y: number, layer: 'block' | 'wall' | 'background', block: Block | null): boolean {
        const cell = this.getCell(x, y)

        if (!cell) {
            return false
        }

        cell[layer] = block
        cell.texture.update()

        return true
    }

    private _getCellLayer(x: number, y: number, layer: 'block' | 'wall' | 'background'): Block | null {
        const cell = this.getCell(x, y)

        if (!cell) {
            return null
        }

        return cell[layer]
    }

    getBlock(x: number, y: number): Block | null {
        return this._getCellLayer(x, y, 'block')
    }
    getWall(x: number, y: number): Block | null {
        return this._getCellLayer(x, y, 'wall')
    }
    getBackground(x: number, y: number): Block | null {
        return this._getCellLayer(x, y, 'background')
    }

    setBlock(x: number, y: number, block: Block | null): boolean {
        if (!this._setCellLayer(x, y, 'block', block)) {
            return false
        }

        this.updateNearestBlocks(x, y)
        return true
    }
    setWall(x: number, y: number, block: Block | null): boolean {
        return this._setCellLayer(x, y, 'wall', block)
    }
    setBackground(x: number, y: number, block: Block | null): boolean {
        return this._setCellLayer(x, y, 'background', block)
    }

    removeBlock(x: number, y: number): Block | null | boolean {
        const cell = this.getCell(x, y)

        if (!cell) {
            return false
        }

        const tempBlock = cell.block
        cell.block = null
        this.updateNearestBlocks(x, y)

        return tempBlock
    }

    moveBlock(x1: number, y1: number, x2: number, y2: number, noUpdate: boolean = false): boolean {
        const oldCell = this.getCell(x1, y1)
        const newCell = this.getCell(x2, y2)

        if (!oldCell || !newCell) {
            return false
        }

        newCell.block = oldCell.block
        oldCell.block = null

        oldCell.texture.update()
        newCell.texture.update()

        if (!noUpdate) {
            this.updateNearestBlocks(x1, y1)
            this.updateNearestBlocks(x2, y2)
        }

        return true
    }

    update = new WorldUpdate()

    updateNearestBlocks(x: number, y: number): boolean {
        if (!this._worldMatrix) {
            return false
        }

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!isWithinMatrix(this._worldMatrix, i, j)) {
                    continue
                }

                this.updateCell(i, j)
            }
        }

        return true
    }

    updateCell(x: number, y: number): boolean {
        if (!this._worldMatrix) {
            return false
        }

        if (!isWithinMatrix(this._worldMatrix, x, y)) {
            return false
        }

        const cell = this.getCell(x, y)
        const key = `pos:${x}.${y}`
        const registeredPositions = this.update.updateBuffer.map(object => object.key)

        if (registeredPositions.includes(key) || !cell) {
            return false
        }

        this.update.addToBuffer({
            key,
            callback: () => {
                const params: BlockUpdateParameters = {
                    x,
                    y,
                    world: this._world
                }

                cell.update(params)
            }
        })

        return true
    }

    async generateWorld(width: number, height: number, generator: (width: number, height: number) => Promise<WorldMatrix>) {
        this._worldMatrix = await generator(width, height)
    }

    get width(): number {
        if (!this._worldMatrix) {
            return 0
        }

        return this._worldMatrix.length
    }

    get height(): number {
        if (!this._worldMatrix || !this._worldMatrix[0]) {
            return 0
        }

        return this._worldMatrix[0].length
    }
}

export class WorldCell {
    private static _lightLevel = 0

    private _layers: WorldCellLayers = {
        background: null,
        wall: null,
        block: null,
        lightLevel: WorldCell._lightLevel
    }

    private _texture = new GeneratedTexture(({ ctx, canvas }) => {
        if (this._layers.background) {
            ctx.drawImage(this._layers.background.getTexture().image, 0, 0)
        }

        if (this._layers.wall) {
            ctx.drawImage(this._layers.wall.getTexture().image, 0, 0)
            
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        if (this._layers.block) {
            ctx.drawImage(this._layers.block.getTexture().image, 0, 0)
        }

        ctx.fillStyle = `rgba(0,0,0,${this._layers.lightLevel})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    })

    async update(params: BlockUpdateParameters) {
        if (!this._layers.block) {
            return
        }

        let updateTexture = false
        
        this._layers.block.event.getEventListeners('update').forEach(updateFunction => {
            const result = updateFunction(params)

            if (result) {
                updateTexture = true
            }
        })

        if (updateTexture) {
            await this._texture.update()
        }
    }

    get texture() { return this._texture }
    get background() { return this._layers.background }
    get wall() { return this._layers.wall }
    get block() { return this._layers.block }
    get lightLevel() { return 1 - this._layers.lightLevel }

    set background(block: Block | null) {
        this._layers.background = block
    }

    set wall(block: Block | null) {
        this._layers.wall = block
    }

    set block(block: Block | null) {
        this._layers.block = block
    }

    set lightLevel(value: number) {
        if (value < 0 || value > 1) {
            throw new Error(`Light level must be float number between 0 and 1. Received: ${value}`)
        }

        this._layers.lightLevel = 1 - value
        this._texture.update()
    }

    static get lightLevel() { return 1 - this._lightLevel }
    static set lightLevel(value: number) {
        if (value < 0 || value > 1) {
            throw new Error(`Light level must be float number between 0 and 1. Received: ${value}`)
        }

        this._lightLevel = 1 - value
    }
}