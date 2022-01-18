import { validateString, validateFunction, validateInstance } from './dataValidator.js'

export default class EventHandler {
    #allowedEvents
    #event = {}

    constructor(allowedEvents = []) {
        validateInstance(allowedEvents, Array, 'Allowed events')

        allowedEvents.map(
            event => {
                validateString(event, 'Event')
                
                event = event.toLowerCase()
                this.#event[event] = {
                    listeners: new Set(),
                    handler: function() {}
                }

                return event
            }
        )

        this.#allowedEvents = new Set(allowedEvents)
    }

    #validateEvent(event) {
        if (!this.#allowedEvents.has(event)) {
            throw new Error(`Unregistered event: ${event}`)
        }
    }

    addEventListener(event, listener) {
        validateString(event, 'Event name')
        validateFunction(listener, 'Event listener')

        event = event.toLowerCase()
        this.#validateEvent(event)
        
        this.#event[event].listeners.add(listener)
        return listener
    }

    setEventHandler(event, handler) {
        validateString(event, 'Event name')
        validateFunction(handler, 'Event handler')

        event = event.toLowerCase()
        this.#validateEvent(event)
        
        this.#event[event].handler = handler
        return handler
    }

    removeEventListener(event, listener) {
        validateString(event, 'Event name')
        validateFunction(listener, 'Event listener')

        event = event.toLowerCase()
        this.#validateEvent(event)

        return this.#event[event].listeners.delete(listener)
    }

    getEventListeners(event) {
        validateString(event, 'Event name')

        event = event.toLowerCase()
        this.#validateEvent(event)
        
        return this.#event[event].listeners
    }

    getEventHandler(event) {
        validateString(event, 'Event name')

        event = event.toLowerCase()
        this.#validateEvent(event)

        return this.#event[event].handler
    }
}