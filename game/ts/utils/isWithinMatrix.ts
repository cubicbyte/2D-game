export default function isWithinMatrix(matrix: Array<Array<any>>, x: number, y: number) {
    const width = matrix.length
    const height = matrix[0].length
    const isWithin = x >= 0 && y >= 0 && x < width && y < height

    return isWithin
}