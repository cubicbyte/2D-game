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