const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Clears all messages in a text channel',
            category: 'Moderation',
            name: 'nuke',
            permissions: ['MANAGE_CHANNELS', 'ADMINISTRATOR'],
        });
    }

    async run(message) {
        const { channel } = message;
        const { position } = channel;

        const cloneChannel = await channel.clone();

        await cloneChannel.setPosition(position);
        await channel.delete();
    }
};
