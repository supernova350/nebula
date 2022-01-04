const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['wd'],
            description: 'This withdraws coins',
            category: 'Economy',
            usage: '<amount>',
            name: 'withdraw',
        });
    }

    async run(message, args) {
        const amount = args[0];

        if (isNaN(amount) || amount % 1 !== 0 || amount <= 0) {
            return this.client.commands.get('help').run(message, ['withdraw']);
        }

        const userData = await this.client.utils.getUserData(
            message.author.id,
            message.guild.id
        );

        if (userData.economy.bank < amount) {
            return message.reply(`You don't have enough coins to withdraw!`);
        }

        const response = await userSchema.findOneAndUpdate(
            {
                userID: message.author.id,
                guildID: message.guild.id,
            },
            {
                $inc: {
                    'economy.bank': -amount,
                    'economy.coins': amount,
                },
            },
            {
                new: true,
            }
        );

        message.reply(
            `You withdrew ${amount} coins from your bank Your bank now has ${response.economy.bank} coins.`
        );
    }
};
