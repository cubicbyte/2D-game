type WorldMatrix = Array<Array<import('../WorldCell').default>>

interface WorldCellLayers {
    background: import('../block').default | null
    wall: import('../block').default | null
    block: import('../block').default | null
    lightLevel: number
}

interface DefaultWorldGeneratorParameters {
    onprogress?(done: number): Promise<void>
    groundAltitudeOffset?: number
}

interface WorldUpdateBufferObject {
    key: string
    callback()
}

interface WorldTextureUpdateParameters {
    onprogress?(progress: number): Promise<void>
}

interface WorldInterface {
    worldData: DefaultWorldData
}

interface WorldDataInterface {
    getCell(x: number, y: number): WorldCell | null
    getBlock(x: number, y: number): Block | null
    getWall(x: number, y: number): Block | null
    getBackground(x: number, y: number): Block | null
    setBlock(x: number, y: number, block: Block | null): boolean
    setWall(x: number, y: number, block: Block | null): boolean
    setBackground(x: number, y: number, block: Block | null): boolean
    removeBlock(x: number, y: number): Block | null | boolean
    moveBlock(x1: number, y1: number, x2: number, y2: number, noUpdate?: boolean): boolean
    updateNearestBlocks(x: number, y: number): boolean
    updateCell(x: number, y: number): boolean

    width: number
    height: number
    update: WorldUpdate
}