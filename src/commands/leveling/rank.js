const Command = require('../../structures/Command');
const User = require('../../models/User');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This shows your rank',
            category: 'Leveling',
            usage: '[user]',
            name: 'rank',
        });
    }

    async run(message, args) {
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

        const memberLevels = await userSchema.find({
            guildID: message.guild.id,
        });
        memberLevels.sort((a, b) => {
            if (a.leveling.level === b.leveling.level) {
                return a.leveling.xp > b.leveling.xp ? -1 : 1;
            }
            return a.leveling.level > b.leveling.level ? -1 : 1;
        });

        if (!memberLevels.length) return; // no levels found

        for (let i = 0; i < memberLevels.length; i++) {
            const member = memberLevels[i];
            if (member.userID === guildUser.user.id) {
                const xpToNext =
                    5 * Math.pow(member.leveling.level, 2) +
                    5 * member.leveling.level +
                    100;

                const rankCard = new canvacord.Rank()
                    .setAvatar(
                        guildUser.user.displayAvatarURL({ format: 'png' })
                    )
                    .setRequiredXP(xpToNext)
                    .setRank(i + 1)
                    .setLevel(member.leveling.level)
                    .setCurrentXP(member.leveling.xp)
                    .setUsername(guildUser.user.username)
                    .setProgressBar('#FFF', 'COLOR')
                    .setDiscriminator(guildUser.user.discriminator);

                rankCard.build().then(data => {
                    const attachment = new MessageAttachment(
                        data,
                        'rankCard.png'
                    );

                    return message.channel.send(attachment);
                });
            }
        }
    }
};
