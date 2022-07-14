interface StoredEvents {
    [event: string]: {
        listeners: Set<Function>
        handler: Function | null
    }
}