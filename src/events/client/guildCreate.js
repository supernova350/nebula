const Event = require('../../structures/event');
const { Guild } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: false,
        });
        this.name = 'guildCreate';
    }

    /**
     *
     * @param {Guild} guild
     */

    async run(guild) {
        const joinChannelNames = ['welcome', 'general', 'chat', 'bot', 'bots'];
        const channel = guild.channels.cache.find(channel =>
            joinChannelNames.includes(channel.name.toLowerCase())
        );

        if (channel) {
            channel.send('Thanks for adding me!');
        }
    }
};
