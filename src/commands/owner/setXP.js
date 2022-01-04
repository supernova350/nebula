const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: "Sets a user's XP",
            category: 'Owner',
            usage: '<user> <new XP>',
            name: 'set-xp',
        });
    }

    async run(message, args) {
        const xpUser = message.mentions.users.first() || args[0];
        const newXP = args[1];

        if (!xpUser || isNaN(newXP) || newXP % 1 !== 0 || newXP < 0) {
            return this.client.commands.get('help').run(message, ['setxp']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === xpUser || m.user.id === xpUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === xpUser
            ) {
                return m;
            }
        });

        await userSchema
            .findOneAndUpdate(
                {
                    userID: guildUser.user.id,
                    guildID: message.guild.id,
                },
                {
                    'leveling.xp': newXP,
                },
                {
                    new: true,
                    upsert: true,
                }
            )
            .catch(err =>
                this.client.logger.error(
                    `Failed to update user XP. Error: ${err}`
                )
            );

        message.reply(`Set <@${guildUser.user.id}>'s XP to ${newXP}`);
    }
};
