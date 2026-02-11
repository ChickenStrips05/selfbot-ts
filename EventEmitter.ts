export default class EventEmitter {
    private events: { [key: string]: Function[] }

    constructor() {
        this.events = {}

        this.on = this.on.bind(this)
        this.emit = this.emit.bind(this)
        this.off = this.off.bind(this)
        this.once = this.once.bind(this)
        this.addListener = this.addListener.bind(this)
        this.removeAllListeners = this.removeAllListeners.bind(this)
    }

    on(event: string, listener: Function) {
        if (!this?.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(listener)
    }

    addListener(event: string, listener: Function) {
        this.on(event, listener)
    }

    emit(event: string, ...args: any) {
        if (!this.events[event]) return
        this.events[event].forEach(listener => listener(...args))
    }

    off(event: string, listener: Function) {
        if (!this.events[event]) return
        this.events[event] = this.events[event].filter(l => l !== listener)
    }

    once(event: string, listener: Function) {
        const wrapper = (...args: any) => {
            this.off(event, wrapper)
            listener(...args)
        }
        this.on(event, wrapper)
    }

    removeAllListeners(event: string) {
        if (event) {
            delete this.events[event]
        } else {
            this.events = {}
        }
    }
}