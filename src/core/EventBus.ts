import type { GameEvent } from "types";

export class EventBus {
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    on(eventType: string, callback: (data: any) => void): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType)!.add(callback);
    }

    off(eventType: string, callback: (data: any) => void): void {
        const callbacks = this.listeners.get(eventType);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    emit(event: GameEvent): void {
        const callbacks = this.listeners.get(event.type);
        if (callbacks) {
            callbacks.forEach(cb => cb(event.data));
        }
    }

    clear(): void {
        this.listeners.clear();
    }
}