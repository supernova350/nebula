const { MessageEmbed, Message } = require('discord.js');
const Command = require('../../structures/Command');
const CC = require('currency-converter-lt');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['cc'],
            description: 'Converts currency (very obvious)',
            category: 'Fun',
            usage: '<from> <to> <amount>',
            name: 'convert-currency',
        });
    }

    async run(message, args) {
        if (args.length !== 3) {
            return this.client.commands
                .get('help')
                .run(message, ['convert-currency']);
        }

        const [from, to, amount] = args;

        if (isNaN(amount) || amount <= 0) {
            return this.client.commands
                .get('help')
                .run(message, ['convert-currency']);
        }

        try {
            const currencyConverter = new CC({
                from: from,
                to: to,
            });

            const converted = await currencyConverter.convert(
                parseFloat(amount)
            );

            const embed = new MessageEmbed().setAuthor(
                `${amount} ${from.toUpperCase()} is ${converted} ${to.toUpperCase()}`
            );

            message.channel.send(embed);
        } catch (err) {
            if (err.toString().includes('is not a valid currency code')) {
                return message.reply('Please provide a valid currency code!');
            }
            this.client.logger.error(`Error while converting currency: ${err}`);
        }
    }
};
