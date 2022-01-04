const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const imageScraper = require('images-scraper');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['img'],
            description: 'Finds an image',
            category: 'Fun',
            usage: '<query>',
            name: 'image',
        });
    }

    async run(message, args) {
        const query = args.join(' ');
        if (!query) {
            return this.client.commands.get('help').run(message, ['image']);
        }

        const google = new imageScraper({
            puppeteer: {
                headless: true,
            },
        });

        const res = await google.scrape(query, 1);

        if (!res) {
            return message.reply('Failed to find an image');
        }

        const data = res[0];

        const embed = new MessageEmbed()
            .setTitle('Image')
            .setAuthor(
                query,
                message.author.displayAvatarURL({ dynamic: true, size: 1024 })
            )
            .setColor(message.guild.me.displayHexColor)
            .setImage(data.url);
        return message.channel.send(embed);
    }
};
