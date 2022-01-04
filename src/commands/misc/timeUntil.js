const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const humanizeDuration = require('humanize-duration');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'See how much time until a date',
            category: 'Utilities',
            usage: '<time point>',
            name: 'time-until',
        });
    }

    async run(message, args) {
        const date = Date.parse(args[0]);

        if (!date) {
            return message.reply(
                'Failed to parse date (use `MM-YY-DD` format)'
            );
        }

        return message.reply(humanizeDuration(date - Date.now()));
    }
};
