const Command = require('../../structures/Command');
const guildSchema = require('../../models/Guild');
const muteSchema = require('../../models/Mute');
const warnSchema = require('../../models/Warn');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This provides modlogs for a user',
            category: 'Moderation',
            usage: '<user> [page]',
            name: 'modlogs',
            permissions: ['ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const modlogsUser = message.mentions.users.first() || args[0];
        const page = args[1];

        if (!modlogsUser || isNaN(page) || page % 1 !== 0 || page < 0) {
            return this.client.commands.get('help').run(message, ['modlogs']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === modlogsUser || m.user.id === modlogsUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === modlogsUser
            ) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        const mutes = await muteSchema.find({
            guildID: message.guild.id,
            userID: guildUser.user.id,
        });

        const warns = await warnSchema.find({
            guildID: message.guild.id,
            userID: guildUser.user.id,
        });
    }
};
