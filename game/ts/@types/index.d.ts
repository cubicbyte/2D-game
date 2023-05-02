interface Point2D {
    x: number
    y: number
}

interface Rectangle extends Point2D {
    width: number
    height: number
}

type PublicConstructor<T> = new (...args: any[]) => T