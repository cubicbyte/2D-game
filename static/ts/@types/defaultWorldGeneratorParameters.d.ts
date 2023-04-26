interface DefaultWorldGeneratorParameters {
    onprogress?(done: number): Promise<void>
    groundAltitudeOffset?: number
}