const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['set-bal'],
            description: "Sets a user's balance",
            category: 'Owner',
            usage: '<user> <amount> [bank]',
            name: 'set-balance',
        });
    }

    async run(message, args) {
        const balanceUser = message.mentions.users.first() || args[0];
        const amount = args[1];
        const coinsOrBank = args[2] || 'coins';

        if (
            !balanceUser ||
            isNaN(amount) ||
            amount % 1 !== 0 ||
            amount < 0 ||
            (coinsOrBank !== 'coins' && coinsOrBank !== 'bank')
        ) {
            return this.client.commands
                .get('help')
                .run(message, ['setbalance']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === balanceUser || m.user.id === balanceUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === balanceUser
            ) {
                return m;
            }
        });

        switch (coinsOrBank) {
            case 'coins': {
                await userSchema
                    .findOneAndUpdate(
                        {
                            userID: guildUser.user.id,
                            guildID: message.guild.id,
                        },
                        {
                            'economy.coins': amount,
                        },
                        {
                            new: true,
                            upsert: true,
                        }
                    )
                    .catch(err =>
                        this.client.logger.error(
                            `Failed to update user coins. Error: ${err}`
                        )
                    );

                message.reply(
                    `Set <@${guildUser.user.id}>'s coins to ${amount}`
                );
                break;
            }
            case 'bank': {
                await userSchema
                    .findOneAndUpdate(
                        {
                            userID: guildUser.user.id,
                            guildID: message.guild.id,
                        },
                        {
                            'economy.bank': amount,
                        },
                        {
                            new: true,
                            upsert: true,
                        }
                    )
                    .catch(err =>
                        this.client.logger.error(
                            `Failed to update user bank. Error: ${err}`
                        )
                    );

                message.reply(
                    `Set <@${guildUser.user.id}>'s bank to ${amount}`
                );
                break;
            }
        }
    }
};
