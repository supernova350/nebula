const { MessageEmbed, Message } = require('discord.js');
const Command = require('../../structures/Command');
const lyricsFinder = require('lyrics-finder');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Find song lyrics',
            category: 'Fun',
            usage: '<query>',
            name: 'lyrics',
        });
    }

    async run(message, args) {
        const query = args.join(' ');
        if (!query) {
            return this.client.commands.get('help').run(message, ['lyrics']);
        }

        try {
            const lyrics =
                (await lyricsFinder(query)) || 'Failed to find lyrics';

            const embed = new MessageEmbed()
                .setTitle('Lyrics')
                .setAuthor(query)
                .setColor(message.guild.me.displayHexColor)
                .setDescription(lyrics);
            return message.channel.send(embed);
        } catch (err) {
            return message.reply('Erorr while finding lyrics');
        }
    }
};
