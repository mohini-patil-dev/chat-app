import { EventEmitter } from 'events';

class Emitter extends EventEmitter {
    constructor() {
        super();
    }
}

export const emitter = new Emitter();
