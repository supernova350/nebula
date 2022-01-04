const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Stop the queue and leave',
            category: 'Music',
            name: 'stop',
        });
    }

    async run(message, args) {}
};
