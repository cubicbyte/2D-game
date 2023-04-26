interface Texture {
    parameters: TextureParameters
    texture: TextureImage
    create(generator: TextureGenerator): import('../Texture').default
    loadFromUrl(url: string): Promise<import('../Texture').default>
    update(params?: TextureParameters): Promise<void>
}