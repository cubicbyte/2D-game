export default class Position {
    public x = 0
    public y = 0

    moveTo(x: number, y: number) {
        this.x = x
        this.y = y
    }

    moveBy(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }

    set(position: Point2D) {
        this.moveTo(position.x, position.y)
    }
}