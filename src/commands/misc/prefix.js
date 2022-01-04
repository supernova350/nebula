const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: "Sets guild's prefix",
            category: 'Utilities',
            usage: '[new prefix]',
            name: 'prefix',
            permissions: ['MANAGE_GUILD', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        let guildData = await this.client.utils.getGuildData(message.guild.id);
        const newPrefix = args[0];

        if (!newPrefix) {
            return message.reply(`Guild's prefix is: ${guildData.prefix}`);
        }

        if (newPrefix.length < 1 || newPrefix.length > 5) {
            return message.reply('1 < x < 5');
        }

        guildData.prefix = newPrefix;
        guildData.save();

        return message.reply(`Set guild's prefix to: ${newPrefix}`);
    }
};
