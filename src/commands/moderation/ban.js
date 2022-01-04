const Command = require('../../structures/Command');
const banSchema = require('../../models/Ban');
const ms = require('ms');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['b'],
            description: 'This bans a member',
            category: 'Moderation',
            usage: '<user>',
            name: 'ban',
            permissions: ['BAN_MEMBERS', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const banUser = message.mentions.users.first() || args[0];
        const duration = args[1];
        const reason =
            (duration ? args.slice(2).join(' ') : args.slice(1).join(' ')) ||
            'No reason provided';

        if (!banUser) {
            return this.client.commands.get('help').run(message, ['ban']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === banUser || m.user.id === banUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === banUser
            ) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        const bans = await message.guild.fetchBans();

        const ban = bans.find(b => b.user == guildUser);

        if (ban) {
            return message.reply('Already banned.');
        }

        const expiry = new Date();
        if (duration) {
            expiry.setTime(expiry.getTime() + ms(duration));
        }

        const guildBans = await banSchema.find({
            guildID: message.guild.id,
        });

        if (duration) {
            await new banSchema({
                banID: guildBans.length + 1,
                guildID: message.guild.id,
                userID: guildUser.user.id,
                modID: message.author.id,
                reason: reason,
                expiry: expiry,
                active: true,
            }).save();
        } else {
            await new banSchema({
                banID: guildBans.length + 1,
                guildID: message.guild.id,
                userID: guildUser.user.id,
                modID: message.author.id,
                reason: reason,
                active: true,
            }).save();
        }

        console.log(guildUser);

        guildUser.ban({ reason: reason }).then(() => {
            return message.reply(
                `Banned ${guildUser.user.username}#${
                    guildUser.user.discriminator
                } for ${reason} (ban ID ${guildBans.length + 1})`
            );
        });
    }
};
