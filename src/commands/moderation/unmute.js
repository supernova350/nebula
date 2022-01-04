const Command = require('../../structures/Command');
const muteSchema = require('../../models/Mute');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This unmutes a member',
            category: 'Moderation',
            usage: '<user>',
            name: 'unmute',
            permissions: [
                'MANAGE_MEMBERS',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'ADMINISTRATOR',
            ],
        });
    }

    async run(message, args) {
        const unmuteUser = message.mentions.users.first() || args[0];

        if (!unmuteUser) {
            return this.client.commands.get('help').run(message, ['unmute']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === unmuteUser || m.user.id === unmuteUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === unmuteUser
            ) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        const mutedRole = message.guild.roles.cache.find(r => {
            return r.name.toLowerCase() === 'muted';
        });

        if (!mutedRole) {
            return message.reply('Muted role not found.');
        }

        const previousMutes = await muteSchema.find({
            guildID: message.guild.id,
            userID: guildUser.user.id,
        });

        const currentlyMuted = previousMutes.filter(m => {
            return m.active;
        });

        if (
            !currentlyMuted.length &&
            !guildUser.roles.cache.find(m => m === mutedRole)
        ) {
            return message.reply('User is not muted.');
        }

        await muteSchema.findOneAndUpdate(
            {
                guildID: message.guild.id,
                userID: guildUser.user.id,
                active: true,
            },
            {
                active: false,
            }
        );

        guildUser.roles.remove(mutedRole).then(() => {
            return message.reply(
                `Unmuted ${guildUser.user.username}#${guildUser.user.discriminator}`
            );
        });
    }
};
