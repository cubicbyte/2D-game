export default function* idGenerator() {
    for (let id = 0; true; id++) {
        yield id
    }
}