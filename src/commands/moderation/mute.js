const Command = require('../../structures/Command');
const muteSchema = require('../../models/Mute');
const ms = require('ms');
const humanize_duration = require('humanize-duration');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['m'],
            description: 'This mutes a member',
            category: 'Moderation',
            usage: '<user> <duration>',
            name: 'mute',
            permissions: ['KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const muteUser = message.mentions.users.first() || args[0];
        const duration = args[1];
        const reason =
            (duration ? args.slice(2).join(' ') : args.slice(1).join(' ')) ||
            'No reason provided';

        if (!muteUser) {
            return this.client.commands.get('help').run(message, ['mute']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === muteUser || m.user.id === muteUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === muteUser
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
            currentlyMuted.length ||
            guildUser.roles.cache.find(m => m === mutedRole)
        ) {
            return message.reply('User is already muted');
        }

        const expiry = new Date();
        if (duration) {
            expiry.setTime(expiry.getTime() + ms(duration));
        }

        const guildMutes = await muteSchema.find({
            guildID: message.guild.id,
        });

        if (duration) {
            await new muteSchema({
                muteID: guildMutes.length + 1,
                guildID: message.guild.id,
                userID: guildUser.user.id,
                modID: message.author.id,
                reason: reason,
                expiry: expiry,
                active: true,
            }).save();
        } else {
            await new muteSchema({
                muteID: guildMutes.length + 1,
                guildID: message.guild.id,
                userID: guildUser.user.id,
                modID: message.author.id,
                reason: reason,
                active: true,
            }).save();
        }

        guildUser.roles.add(mutedRole).then(() => {
            return message.reply(
                `Muted ${guildUser.user.username}#${
                    guildUser.user.discriminator
                } for ${reason} (mute ID ${guildMutes.length + 1})`
            );
        });
    }
};
