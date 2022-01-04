const Event = require('../../structures/Event');
const ms = require('ms');
const { CommandInteraction } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: false,
        });
        this.name = 'interactionCreate';
    }

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async run(interaction) {
        if (!interaction.isCommand()) return;

        const args = [];
        interaction.options.data.map(arg => args.push(arg.value));

        const command = this.client.slashCommands.get(interaction.commandName);

        if (!command) return;

        try {
            command.run(interaction, args);
        } catch (err) {}
    }
};
