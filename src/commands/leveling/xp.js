const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This shows your xp',
            category: 'Leveling',
            usage: '[user]',
            name: 'xp',
        });
    }

    async run(message) {
        const levelUser = message.mentions.users.first() || args[0];

        const guildUser =
            message.guild.members.cache.find(m => {
                if (m.user === levelUser || m.user.id === levelUser) {
                    return m;
                } else if (
                    `${m.user.username}#${m.user.discriminator}` === levelUser
                ) {
                    return m;
                }
            }) || message.member;

        const userData = await this.client.utils.getUserData(
            guildUser.user.id,
            message.guild.id
        );

        const xpToNext =
            5 * Math.pow(userData.leveling.level, 2) +
            5 * userData.leveling.level +
            100;
        return message.channel.send(
            `<@${guildUser.user.id}> has ${userData.leveling.xp}/${xpToNext} XP!`
        );
    }
};
