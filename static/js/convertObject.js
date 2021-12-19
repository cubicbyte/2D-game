export default function convertObject(object) {
    const newObject = {}

    for (const key in object) {
        const value = object[key]

        if (typeof key === 'string' && key[0] === '_') {
            if (key[1] === '_') {
                continue
            }

            const properties = {
                get() { return newObject[key] }
            }
            
            if (typeof value === 'function') {
                properties['set'] = newValue => {
                    newObject[key] = value(newValue)
                }

                newObject[key] = object.hasOwnProperty(`_${key}`) ? object[`_${key}`] : null
            }
            else {
                newObject[key] = value
            }

            Object.defineProperty(newObject, key.substring(1), properties)
            continue
        }

        newObject[key] = value
    }

    return newObject
}