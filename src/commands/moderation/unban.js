const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['ub'],
            description: 'This unbans a member',
            category: 'Moderation',
            usage: '<user>',
            name: 'unban',
            permissions: ['BAN_MEMBERS', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const unbanUser = message.mentions.users.first() || args[0];

        if (!unbanUser) {
            return this.client.commands.get('help').run(message, ['unban']);
        }

        const bans = await message.guild.fetchBans();
        if (bans.size === 0) {
            return message.reply('Guild has no bans.');
        }

        const ban = bans.find(b => {
            if (b.user === unbanUser || b.user.id === unbanUser) {
                return b;
            } else if (
                `${b.user.username}#${b.user.discriminator}` === unbanUser
            ) {
                return b;
            }
        });

        if (!ban) {
            return message.reply('No ban found.');
        }

        message.guild.members.unban(ban.user).then(() => {
            return message.reply(
                `Unbanned ${ban.user.username}#${ban.user.discriminator}`
            );
        });
    }
};
