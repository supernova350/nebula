const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const guildSchema = require('../../models/Guild');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['cfg'],
            description: 'Sets suggestions channel',
            category: 'Utilities',
            usage: '<channel>',
            name: 'suggestions-channel',
            permissions: ['MANAGE_CHANNELS', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply('Please mention the suggestions channel.');
        }

        const res = await guildSchema.findOneAndUpdate(
            {
                guildID: message.guild.id,
            },
            {
                suggestionsChannelID: channel.id,
            },
            {
                new: true,
                upsert: true,
            }
        );
    }
};
