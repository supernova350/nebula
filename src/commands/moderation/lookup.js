const Command = require('../../structures/Command');
const muteSchema = require('../../models/Mute');
const warnSchema = require('../../models/Warn');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Looks up mod logs',
            category: 'Moderation',
            usage: '<user> <ID> <warn or mute>',
            name: 'lookup',
            permissions: ['MANAGE_MEMBERS', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const lookupUser = message.mentions.users.first() || args[0];
        const ID = args[1];
        const warnOrMute = args[2];

        if (!lookupUser || !warnOrMute || !ID) {
            return this.client.commands.get('help').run(message, ['lookup']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === lookupUser || m.user.id === lookupUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === lookupUser
            ) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        switch (warnOrMute.toLowerCase()) {
            case 'warn':
                const warn = await warnSchema.findOne({
                    guildID: message.guild.id,
                    userID: guildUser.user.id,
                    warnID: ID,
                });

                console.log(warn);

                if (!warn) {
                    return message.reply('no warn found.');
                }

                return message.reply(JSON.stringify(warn));
                break;
            case 'mute':
                const mute = await muteSchema.findOne({
                    guildID: message.guild.id,
                    userID: guildUser.user.id,
                    muteID: ID,
                });

                if (!mute) {
                    return message.reply('no mute found.');
                }
                return message.reply(JSON.stringify(mute));
                break;
        }
    }
};
