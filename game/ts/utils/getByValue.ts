function getKeyByValue<T>(map: Map<T, any>, value: any): T | undefined {
    for (const [key, val] of map) {
        if (val === value) {
            return key
        }
    }
}

export default getKeyByValue