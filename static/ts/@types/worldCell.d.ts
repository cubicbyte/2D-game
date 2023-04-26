interface WorldCell {
    update(params: BlockUpdateParameters): boolean
    texture: import('../Texture').default
    background: import('../block').default | null
    wall: import('../block').default | null
    block: import('../block').default | null
    lightLevel: number
}