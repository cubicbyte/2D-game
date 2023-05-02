export default function random(max: number = 256, min: number = 0): number {
    return Math.floor(Math.random() * (max - min) + min)
}