const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['dep'],
            description: 'This deposits coins',
            category: 'Economy',
            usage: '<amount>',
            name: 'deposit',
        });
    }

    async run(message, args) {
        const amount = args[0];

        if (isNaN(amount) || amount % 1 !== 0 || amount <= 0) {
            return this.client.commands.get('help').run(message, ['deposit']);
        }

        const userData = await this.client.utils.getUserData(
            message.author.id,
            message.guild.id
        );

        if (userData.economy.coins < amount) {
            return message.reply(`You don't have enough coins to deposit!`);
        }

        const response = await userSchema.findOneAndUpdate(
            {
                userID: message.author.id,
                guildID: message.guild.id,
            },
            {
                $inc: {
                    'economy.coins': -amount,
                    'economy.bank': amount,
                },
            },
            {
                new: true,
            }
        );

        message.reply(
            `You deposited ${amount} coins into your bank Your wallet now has ${response.economy.coins} coins.`
        );
    }
};
