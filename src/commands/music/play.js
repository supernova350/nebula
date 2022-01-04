const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Plays a song',
            category: 'Music',
            usage: '<song query>',
            name: 'play',
        });
    }

    async run(message, args) {}
};
