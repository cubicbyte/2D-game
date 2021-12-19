import { validateString, validateFunction } from './dataValidator.js'

export default class Event {
    static #event = {}
    #event = {}

    addEventListener(event, listener) {
        validateString(event, 'Event name')
        validateFunction(listener, 'Event listener')

        event = event.toLowerCase()

        if (!this.#event[event]) this.#event[event] = {
            listeners: new Set(),
            handler: null
        }
        
        this.#event[event].listeners.add(listener)
        return listener
    }

    setEventHandler(event, handler) {
        validateString(event, 'Event name')
        validateFunction(handler, 'Event handler')

        event = event.toLowerCase()

        if (!this.#event[event]) this.#event[event] = {
            listeners: new Set(),
            handler: null
        }
        
        this.#event[event].handler = handler
        return handler
    }

    removeEventListener(event, listener) {
        validateString(event, 'Event name')
        validateFunction(listener, 'Event listener')

        event = event.toLowerCase()

        if (!this.#event[event]) {
            return false
        }

        return this.#event[event].listeners.delete(listener)
    }

    getEventListeners(event) {
        validateString(event, 'Event name')

        event = event.toLowerCase()

        if (!this.#event[event]) {
            return new Set()
        }

        return this.#event[event].listeners
    }

    getEventHandler(event) {
        validateString(event, 'Event name')

        event = event.toLowerCase()

        if (!this.#event[event]) {
            return function() {}
        }

        if (!this.#event[event].handler) {
            return function() {}
        }

        return this.#event[event].handler
    }



    static addEventListener(event, listener) {
        validateString(event, 'Event name')
        validateFunction(listener, 'Event listener')

        event = event.toLowerCase()

        if (!this.#event[event]) this.#event[event] = {
            listeners: new Set(),
            handler: null
        }
        
        this.#event[event].listeners.add(listener)
        return listener
    }

    static setEventHandler(event, handler) {
        validateString(event, 'Event name')
        validateFunction(handler, 'Event handler')

        event = event.toLowerCase()

        if (!this.#event[event]) this.#event[event] = {
            listeners: new Set(),
            handler: null
        }
        
        this.#event[event].handler = handler
        return handler
    }

    static removeEventListener(event, listener) {
        validateString(event, 'Event name')
        validateFunction(listener, 'Event listener')

        event = event.toLowerCase()

        if (!this.#event[event]) {
            return false
        }

        return this.#event[event].listeners.delete(listener)
    }

    static getEventListeners(event) {
        validateString(event, 'Event name')

        event = event.toLowerCase()

        if (!this.#event[event]) {
            return new Set()
        }

        return this.#event[event].listeners
    }

    static getEventHandler(event) {
        validateString(event, 'Event name')

        event = event.toLowerCase()

        if (!this.#event[event]) {
            return function() {}
        }

        if (!this.#event[event].handler) {
            return function() {}
        }

        return this.#event[event].handler
    }
}