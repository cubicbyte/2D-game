function isFunctionAsync(func: Function): boolean {
    const asyncFunction = async function() {}
    const asyncFunctionConstructor = asyncFunction.constructor

    return func.constructor === asyncFunctionConstructor
}