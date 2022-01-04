const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Summons the music bot',
            category: 'Music',
            usage: '[channel]',
            name: 'summon',
        });
    }

    async run(message, args) {}
};
