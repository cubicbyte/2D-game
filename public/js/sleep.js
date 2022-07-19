import { isPositiveInteger } from './dataValidator.js';

export default function sleep(time) {
    return new Promise(resolve => {
        if (!isPositiveInteger(time)) {
            return requestAnimationFrame(resolve)
        }

        setTimeout(resolve, time)
    })
}