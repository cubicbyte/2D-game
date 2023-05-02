
type Block = import('../block').default
type BlockSubclass = PublicConstructor<Block>

// TODO separate this into BlockProperties and BlockState
interface BlockProperties {
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