interface DatapackManifestV1 {
    manifestVersion: 1
    version: string
    name: string
    description: string
    entrypoint: string
}

type DatapackManifest = DatapackManifestV1

interface DatapackInfo {
    manifest: DatapackManifest
    blockTextures: string[]
}