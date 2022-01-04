const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Skips a song in queue',
            category: 'Music',
            name: 'skip',
        });
    }

    async run(message, args) {}
};
