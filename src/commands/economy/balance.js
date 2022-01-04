const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['bal'],
            description: 'Shows your balance',
            category: 'Economy',
            name: 'balance',
        });
    }

    async run(message, args) {
        try {
            const guildUser = this.client.utils.getGuildMember(message, args);

            const userData = await this.client.utils.getUserData(
                guildUser.user.id,
                message.guild.id
            );

            const embed = new MessageEmbed()
                .setTitle('Balance')
                .setAuthor(
                    guildUser.user.tag,
                    guildUser.user.displayAvatarURL({ dynamic: true })
                )
                .addFields(
                    {
                        name: 'COINS',
                        value: `💰 ${userData.economy.coins
                            .toString()
                            .toLocaleString()}`,
                        inline: true,
                    },
                    {
                        name: 'BANK',
                        value: `🏦 ${userData.economy.bank
                            .toString()
                            .toLocaleString()}`,
                        inline: true,
                    }
                );

            message.channel.send(embed);
        } catch (err) {
            this.client.logger.error(err);
        }
    }
};
