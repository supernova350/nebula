module.exports = class SlashCommand {
    constructor(client, options = {}) {
        /* These are required */
        this.client = client;
        this.options = options;
        this.name = options.name;
        this.description = options.description;

        /* These are not required, but helpful */
        this.aliases = options.aliases || [];
        this.category = options.category || undefined;
        this.permissions = options.permissions || [];
    }

    async run(interction, args) {}
};
