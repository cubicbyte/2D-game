export default function textToScriptFile(text) {
    const blob = new Blob([text], { type: 'text/javascript' })
    const file = window.URL.createObjectURL(blob)

    return file
}