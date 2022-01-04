module.exports = class Command {
    constructor(client, options = {}) {
        /* These are required */
        this.client = client;
        this.name = options.name;

        /* These are not required, but helpful */
        this.usage = options.usage || undefined;
        this.aliases = options.aliases || [];
        this.description = options.description || undefined;
        this.category = options.category || undefined;
        this.permissions = options.permissions || [];
    }

    getUsage(prefix) {
        return `${prefix}${this.name} ${this.usage || ''}`.trim();
    }

    async run(message, ...args) {}
};
