export default function random(max = 256, min = 0) {
    return Math.floor(Math.random() * (max - min) + min)
}