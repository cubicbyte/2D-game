interface BlockInterface {
    readonly texture: import('../Texture').default
    properties: BlockProperties
    event: import('../utils/eventHandler').default
}

interface BlockProperties {
    id: string
    level?: number
    minLevel?: number
    maxLevel?: number
    levelStep?: number
    hasGravity?: boolean
    falling?: boolean
}

interface BlockUpdateParameters {
    x: number
    y: number
    world: import('../World').default
}