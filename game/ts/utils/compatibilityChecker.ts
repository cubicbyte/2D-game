class CompatibilityError extends Error {
    static helpMessage = 'Please use a browser that supports this feature.'

    constructor(message: string) {
        super(message + '\n' + CompatibilityError.helpMessage)
        this.name = 'CompatibilityError'
    }
}

function checkCompatibility() {
    if (!globalThis.hasOwnProperty('CanvasRenderingContext2Dd')) {
        throw new CompatibilityError('CanvasRenderingContext2D is not supported, but is required to render the game.')
    }
}

export { CompatibilityError }
export default checkCompatibility