const Command = require('../../structures/Command');
const warnSchema = require('../../models/Warn');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This unwarns a user',
            category: 'Moderation',
            usage: '<warn ID>',
            name: 'unwarn',
            permissions: [
                'MANAGE_MEMBERS',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'ADMINISTRATOR',
            ],
        });
    }

    async run(message, args) {
        const warnID = args[0];

        if (isNaN(warnID)) {
            return this.client.commands.get('help').run(message, ['unwarn']);
        }

        const warn = await warnSchema.findOneAndUpdate(
            {
                guildID: message.guild.id,
                warnID: warnID,
                active: true,
            },
            {
                active: false,
            }
        );

        if (!warn) {
            return message.reply('No active warn ID found.');
        }

        const guild = this.client.guilds.cache.get(warn.guildID);
        const member = (await guild.members.fetch()).get(warn.userID);

        return message.reply(
            `Unwarned ${member.user.username}#${member.user.discriminator}`
        );
    }
};
