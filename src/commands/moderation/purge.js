const Command = require('../../structures/Command');
const ms = require('ms');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['clear'],
            description: 'Purge a number of messages',
            category: 'Moderation',
            name: 'purge',
            permissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const purgeNumber = args[0];

        if (
            !purgeNumber ||
            isNaN(purgeNumber) ||
            purgeNumber % 1 !== 0 ||
            purgeNumber < 1 ||
            purgeNumber > 100
        ) {
            return this.client.commands.get('help').run(message, ['purge']);
        }

        await message.delete();

        const messages = await message.channel.messages.fetch({
            limit: parseInt(purgeNumber),
        });
        const deletable = messages.filter(
            m => m.createdTimestamp - Date.now() < ms('14d') && !m.pinned
        );

        await message.channel.bulkDelete(deletable);
    }
};
