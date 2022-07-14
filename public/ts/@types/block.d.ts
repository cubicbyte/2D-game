interface BlockInterface {
    readonly texture: import('../Texture').default
    properties: BlockProperties
    event: import('../utils/eventHandler').default
}