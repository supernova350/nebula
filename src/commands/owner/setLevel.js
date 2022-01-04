const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['set-lvl'],
            description: "Sets a user's level",
            category: 'Owner',
            usage: '<user> <new level>',
            name: 'set-level',
        });
    }

    async run(message, args) {
        const levelUser = message.mentions.users.first() || args[0];
        const newLevel = args[1];

        if (
            !levelUser ||
            isNaN(newLevel) ||
            newLevel % 1 !== 0 ||
            newLevel < 0
        ) {
            return this.client.commands.get('help').run(message, ['setlevel']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === levelUser || m.user.id === levelUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === levelUser
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
                    'leveling.level': newLevel,
                },
                {
                    new: true,
                    upsert: true,
                }
            )
            .catch(err =>
                this.client.logger.error(
                    `Failed to update user level. Error: ${err}`
                )
            );

        message.reply(`Set <@${guildUser.user.id}>'s level to ${newLevel}`);
    }
};
