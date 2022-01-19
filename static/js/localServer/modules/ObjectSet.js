import { validateInstance } from './dataValidator.js'
import EventHandler from './Event.js'

export default class ObjectSet extends Set {
    EventHandler = new EventHandler([ 'add', 'delete' ])

    #superClass
    #add = this.add
    #delete = this.delete

    constructor(superClass, ...rest) {
        super(...rest)
        this.#superClass = superClass
    }

    add(object) {
        validateInstance(object, this.#superClass)

        const addHandler = this.EventHandler.getEventHandler('add')
        const result = addHandler(object, this)

        if (result === false) {
            return false
        }

        this.#add(object)
        this.EventHandler.getEventListeners('add').forEach(
            listener => listener(object, this)
        )

        return true
    }

    delete(object) {
        const result = this.#delete(object)

        if (result) {
            const deleteHandler = this.EventHandler.getEventHandler('delete')
            const result = deleteHandler(object, this)

            if (result === false) {
                return false
            }

            this.#delete()

            this.EventHandler.getEventListeners('delete').forEach(
                listener => listener(object, this)
            )
        }

        return result
    }
}