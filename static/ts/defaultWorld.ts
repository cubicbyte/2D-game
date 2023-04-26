import DefaultWorldData from './defaultWorldData.js'
import { default as AbstractWorld } from './World.js'

export namespace DefaultWorld {
    export class World extends AbstractWorld {
        public worldData: DefaultWorldData = new DefaultWorldData(this)

        async updateTextures(params: WorldTextureUpdateParameters = {}) {
            if (!params.onprogress) {
                params.onprogress = async function() {}
            }

            for (let i = 0; i < this.worldData.width; i++) {
                for (let j = 0; j < this.worldData.height; j++) {
                    this.worldData.getCell(i, j)?.texture.update()
                }

                await params.onprogress((i + 1) / this.worldData.width)
            }
        }
    }
    
    export interface WorldTextureUpdateParameters {
        onprogress?(progress: number): Promise<void>
    }
}