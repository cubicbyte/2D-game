export function validateObject(object, description = 'Data') {
    const objectType = typeof object
    const errorText = `${description} must be of type Object. Received type: ${objectType}`

    if (objectType !== 'object') {
        throw new TypeError(errorText)
    }
}

export function validateBoolean(object, description = 'Flag') {
    const objectType = typeof object
    const errorText = `${description} must be an boolean. Received type: ${objectType}`

    if (objectType !== 'boolean') {
        throw new TypeError(errorText)
    }
}

export function validateInteger(object, description = 'Data') {
    const objectType = typeof object
    const isInteger = Number.isInteger(object)
    const errorText = `${description} must be an integer.${objectType !== 'number' ? ` Received type: ${objectType}` : ''}`

    if (!isInteger) {
        throw new TypeError(errorText)
    }
}

export function validatePositiveInteger(object, description = 'Data') {
    const objectType = typeof object
    const errorText = `${description} must be a positive integer.${objectType !== 'number' ? ` Received type: ${objectType}` : ''}`

    if (!isPositiveInteger(object)) {
        throw new TypeError(errorText)
    }
}

export function validateFinite(object, description = 'Data') {
    const objectType = typeof object
    const isFinite = Number.isFinite(object)
    const errorText = `${description} must be a floating point number.${objectType !== 'number' ? ` Received type: ${objectType}` : ''}`

    if (!isFinite) {
        throw new TypeError(errorText)
    }
}

export function validateFunction(object, description = 'Data') {
    const objectType = typeof object
    const errorText = `${description} must be of type Function. Received type: ${objectType}`

    if (objectType !== 'function') {
        throw new TypeError(errorText)
    }
}

export function validateImage(object, description = 'Data', checkCorrect = true) {
    const objectType = typeof object

    if (!object) {
        throw new TypeError(`${description} must be an image. Received type: ${objectType}`)
    }

    if (object.constructor !== Image) {
        throw new TypeError(`${description} must be an image. Received object: ${object.constructor}`)
    }

    if (checkCorrect) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        try {
            ctx.drawImage(object, 0, 0)
        } catch {
            throw new Error(`${description} must be a correct image`)
        }
    }
}

export function validateInstance(object, constructor, description = 'Object', checkInheritance = false) {
    validateFunction(constructor)
    const errorText = `${description} must be instance of ${constructor.name}${checkInheritance ? ' or inherit from it' : ''}. ${typeof object === 'object' ? `Current instance: ${object.constructor.name}` : `Received type: ${typeof object}`}`
    
    if (!isInstance(object, constructor, checkInheritance)) {
        throw new Error(errorText)
    }
}

export function validateString(object, description = 'Object') {
    const objectType = typeof object
    const errorText = `${description} must be an string. Received type: ${objectType}`

    if (objectType !== 'string') {
        throw new TypeError(errorText)
    }
}

export function validateWithinMatrix(matrix, x, y, description = 'Matrix') {
    const isWithin = isWithinMatrix(matrix, x, y)

    if (!isWithin) {
        throw new Error(`The index [${x},${y}] is out of the range of ${description}`)
    }
}

export function isPositiveInteger(object) {
    return Number.isInteger(object) && object >= 0
}

export function isFunction(object) {
    return typeof object === 'function'
}

export function isFunctionAsync(object) {
    const asyncFunction = async function() {}
    const asyncFunctionConstructor = asyncFunction.constructor

    return object && object.constructor === asyncFunctionConstructor
}

export function isInstance(object, constructor, checkInheritance = false) {
    const instance = object instanceof constructor

    if (!checkInheritance || instance) {
        return instance
    }

    if (object === undefined || object === null || !object.prototype) {
        return false
    }

    return object.prototype instanceof constructor || object.prototype.constructor === constructor
}

export function isWithinMatrix(matrix, x, y) {
    const width = matrix.length
    const height = matrix[0].length
    const isWithin = x >= 0 && y >= 0 && x < width && y < height

    return isWithin
}