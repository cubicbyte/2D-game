interface TextureGenerator {
    (parameters: TextureGeneratorParameters): Promise<void> | void
}