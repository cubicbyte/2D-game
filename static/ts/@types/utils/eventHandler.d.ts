interface EventHandlerInterface {
    addEventListener(event: string, listener: Function): void
    setEventHandler(event: string, handler: Function): void
    removeEventListener(event: string, listener: Function): boolean
    getEventListeners(event: string): Set<Function>
    getEventHandler(event: string): Function | null
}

interface StoredEvents {
    [event: string]: {
        listeners: Set<Function>
        handler: Function | null
    }
}