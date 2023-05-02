interface ControlObject extends Point2D {}

interface ControlKeys {
    [key: string]: {
        key: string
        pressed: boolean
    }
}

interface ControlParameters {
    object: ControlObject
    speed?: number
}