import { GlobalEvents } from './emitterEvents';

type EventHandler<T> = (event: T) => void;

class Emitter<Events extends Record<string, any>> {
    static instance: Emitter<any> | null = null;
    public listeners: { [K in keyof Events]?: EventHandler<Events[K]>[] } = {};

    constructor() {}

    public static getInstance<Events extends Record<string, any>>(): Emitter<Events> {
        if (!Emitter.instance) {
            Emitter.instance = new Emitter<Events>();
        }
        return Emitter.instance as Emitter<Events>;
    }

    public on<K extends keyof Events>(event: K, listener: EventHandler<Events[K]>): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(listener);
    }

    public off<K extends keyof Events>(event: K, listener: EventHandler<Events[K]>): void {
        if (!this.listeners[event]) return;

        this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
    }

    public emit<K extends keyof Events>(event: K, data: Events[K]): void {
        if (!this.listeners[event]) return;

        for (const listener of this.listeners[event]!) {
            listener(data);
        }
    }
}

export const emitter = Emitter.getInstance<GlobalEvents>();
