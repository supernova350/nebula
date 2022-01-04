const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const translate = require('translate');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Discord Translate',
            category: 'Fun',
            usage: '<language to> <text>',
            name: 'translate',
        });

        translate.engine = 'google';
        translate.key = this.client.config.apiKey.google;
    }

    async run(message, args) {
        const [to, ...text] = args;

        try {
            const translated = await translate(text, to);
            message.reply(translated);
        } catch (err) {
            this.client.logger.error(`Error while translating text: ${err}`);
        }
    }
};
