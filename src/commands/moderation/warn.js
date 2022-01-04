const Command = require('../../structures/Command');
const warnSchema = require('../../models/Warn');
const ms = require('ms');
const humanize_duration = require('humanize-duration');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This warns a user',
            category: 'Moderation',
            usage: '<user>',
            name: 'warn',
            permissions: [
                'MANAGE_MEMBERS',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'ADMINISTRATOR',
            ],
        });
    }

    async run(message, args) {
        const warnUser = message.mentions.users.first() || args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!warnUser) {
            return this.client.commands.get('help').run(message, ['warn']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === warnUser || m.user.id === warnUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === warnUser
            ) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        const guildWarns = await warnSchema.find({
            guildID: message.guild.id,
        });

        await new warnSchema({
            warnID: guildWarns.length + 1,
            guildID: message.guild.id,
            userID: guildUser.user.id,
            modID: message.author.id,
            reason: reason,
            active: true,
        }).save();

        return message.reply(
            `Warned ${guildUser.user.username}#${
                guildUser.user.discriminator
            } for ${reason} (warn ID ${guildWarns.length + 1})`
        );
    }
};
