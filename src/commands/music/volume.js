const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Sets the volume',
            category: 'Music',
            usage: '[new volume]',
            name: 'volume',
        });
    }

    async run(message, args) {}
};
