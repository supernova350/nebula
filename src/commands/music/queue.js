const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Shows the guild queue',
            category: 'Music',
            name: 'queue',
        });
    }

    async run(message, args) {}
};
