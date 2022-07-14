import Block from './block.js'
import WorldUpdate from './worldUpdate.js'
import isWithinMatrix from './utils/isWithinMatrix.js'
import World from './World.js'
import WorldCell from './WorldCell.js'

export default class DefaultWorldData {
    private _worldMatrix: WorldMatrix | null = null

    constructor (private _world: World) {}

    public getCell(x: number, y: number): WorldCell | null {
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

    public getBlock(x: number, y: number): Block | null {
        return this._getCellLayer(x, y, 'block')
    }
    public getWall(x: number, y: number): Block | null {
        return this._getCellLayer(x, y, 'wall')
    }
    public getBackground(x: number, y: number): Block | null {
        return this._getCellLayer(x, y, 'background')
    }

    public setBlock(x: number, y: number, block: Block | null): boolean {
        if (!this._setCellLayer(x, y, 'block', block)) {
            return false
        }

        this.updateNearestBlocks(x, y)
        return true
    }
    public setWall(x: number, y: number, block: Block | null): boolean {
        return this._setCellLayer(x, y, 'wall', block)
    }
    public setBackground(x: number, y: number, block: Block | null): boolean {
        return this._setCellLayer(x, y, 'background', block)
    }

    public removeBlock(x: number, y: number): Block | null | boolean {
        const cell = this.getCell(x, y)

        if (!cell) {
            return false
        }

        const tempBlock = cell.block
        cell.block = null
        this.updateNearestBlocks(x, y)

        return tempBlock
    }

    public moveBlock(x1: number, y1: number, x2: number, y2: number, noUpdate: boolean = false): boolean {
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

    public update = new WorldUpdate()

    public updateNearestBlocks(x: number, y: number): boolean {
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

    public updateCell(x: number, y: number): boolean {
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