class Event {
    constructor(client, options = {}) {
        this.client = client;
        this.name = options.name;
        this.type = options.once ? 'once' : 'on';
        this.emitter =
            (typeof options.emitter === 'string'
                ? this.client[options.emitter]
                : options.emitter) || this.client;
    }

    async run(...args) {}
}

module.exports = Event;
