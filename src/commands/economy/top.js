const Command = require('../../structures/Command');
const User = require('../../models/User');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: "This shows the guild's economy leaderboard",
            category: 'Economy',
            name: 'top',
        });
    }

    async run(message) {
        const memberEconomy = await userSchema.find({
            guildID: message.guild.id,
        });
        memberEconomy.sort((a, b) =>
            a.economy.coins + a.economy.bank > b.economy.coins + b.economy.bank
                ? -1
                : 1
        );

        if (!memberEconomy.length) return; // no levels found

        let levels = [];

        for (let i = 0; i < memberEconomy.length; i++) {
            const member = memberEconomy[i];
            levels.push(
                `#${i + 1} - <@${memberEconomy[i].userID}> (Net Worth $${(
                    memberEconomy[i].economy.coins +
                    memberEconomy[i].economy.bank
                )
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')})`
            );
        }

        const embed = new MessageEmbed()
            .setTitle('Economy Top')
            .setAuthor(
                `${message.guild.name}`,
                message.guild.iconURL({ dynamic: true }),
                null
            )
            .setDescription(levels.join('\n'));

        message.channel.send(embed);
    }
};
