export function getObjectByPropertyValue(array, property, value) {
    array.forEach(object => {
        if (object[property] === value) {
            return object
        }
    })
}

export function getObjectsByPropertyValue(array, property, value) {
    let objects = []

    array.forEach(object => {
        if (object[property] === value) {
            objects.push(object)
        }
    })
    
    return objects
}