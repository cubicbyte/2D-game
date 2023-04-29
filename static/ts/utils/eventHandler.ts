export default class EventHandler {
    private _allowedEvents: Set<string>
    private _storedEvents: StoredEvents

    constructor(allowedEvents: string[] = []) {
        const storedEvents: StoredEvents = {}

        allowedEvents.map(
            event => {
                event = event.toLowerCase()
                storedEvents[event] = {
                    listeners: new Set<Function>(),
                    handler: null
                }

                return event
            }
        )

        this._storedEvents = storedEvents
        this._allowedEvents = new Set<string>(allowedEvents)
    }

    private validateEvent(event: string) {
        if (!this._allowedEvents.has(event)) {
            throw new Error(`Unregistered event: ${event}`)
        }
    }

    addEventListener(event: string, listener: Function) {
        event = event.toLowerCase()
        this.validateEvent(event)
        
        this._storedEvents[event].listeners.add(listener)
    }

    setEventHandler(event: string, handler: Function) {
        event = event.toLowerCase()
        this.validateEvent(event)
        
        this._storedEvents[event].handler = handler
    }

    removeEventListener(event: string, listener: Function): boolean {
        event = event.toLowerCase()
        this.validateEvent(event)

        return this._storedEvents[event].listeners.delete(listener)
    }

    getEventListeners(event: string): Set<Function> {
        event = event.toLowerCase()
        this.validateEvent(event)
        
        return this._storedEvents[event].listeners
    }

    getEventHandler(event: string): Function | null {
        event = event.toLowerCase()
        this.validateEvent(event)

        return this._storedEvents[event].handler
    }
}