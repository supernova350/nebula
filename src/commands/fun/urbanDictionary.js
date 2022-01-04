const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const axios = require('axios');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: ':)',
            category: 'Fun',
            usage: '',
            name: 'urban-dictionary',
        });
    }

    async run(message, args) {
        const toDefine = args.join(' ');

        const {
            data: { list },
        } = await axios.get(
            `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
                toDefine
            )}`
        );
        const [answer] = list;

        return message.reply(JSON.stringify(answer));
    }
};
