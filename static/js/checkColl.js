import { validateObject } from './dataValidator.js'

export default function checkColl(object1, object2) {
    validateObject(object1, 'Object #1')
    validateObject(object2, 'Object #2')

    const isColl = (
        object1.x < object2.x + object2.width &&
        object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height &&
        object1.y + object1.height > object2.y
    )

    return isColl
}