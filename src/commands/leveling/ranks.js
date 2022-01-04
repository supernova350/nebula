const Command = require('../../structures/Command');
const User = require('../../models/User');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: "This shows the guild's leveling leaderboard",
            category: 'Leveling',
            name: 'ranks',
        });
    }

    async run(message) {
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

        let levels = [];

        for (let i = 0; i < memberLevels.length; i++) {
            const member = memberLevels[i];
            const xpToNext =
                5 * Math.pow(member.leveling.level, 2) +
                5 * member.leveling.level +
                100;
            levels.push(
                `#${i + 1} - <@${member.userID}> (Level ${
                    member.leveling.level
                }, ${member.leveling.xp}/${xpToNext} XP)`
            );
        }

        const embed = new MessageEmbed()
            .setTitle('Leveling Leaderboard')
            .setAuthor(
                `${message.guild.name}`,
                message.guild.iconURL({ dynamic: true }),
                null
            )
            .setDescription(levels.join('\n'));

        message.channel.send(embed);
    }
};
