export default class Position {

    constructor(
        public x: number = 0,
        public y: number = 0
    ) { }

    moveTo(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    moveBy(dx: number, dy: number): void {
        this.x += dx
        this.y += dy
    }

    set(position: Point2D): void {
        this.moveTo(position.x, position.y)
    }

    get truncated(): Position {
        return new Position(Math.floor(this.x), Math.floor(this.y))
    }
}