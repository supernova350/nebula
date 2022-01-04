const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const suggestionSchema = require('../../models/suggestion');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Make a suggestion',
            category: 'Utilities',
            usage: '<suggestion>',
            name: 'suggest',
        });
    }

    async run(message, args) {
        const suggestion = args.join(' ');

        if (!suggestion) {
            return message.reply('Suggestion cannot be empty');
        }

        const guildData = await this.client.utils.getGuildData(
            message.guild.id
        );
        const suggestionsChannel = this.client.channels.cache.get(
            guildData.suggestionsChannelID
        );

        try {
            const embed = new MessageEmbed()
                .setTitle('Suggestion')
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setDescription(suggestion);

            const sentMessage = await suggestionsChannel.send(embed);
            await sentMessage.react('👍');
            await sentMessage.react('👎');

            embed.setFooter(`ID: ${sentMessage.id}`);
            await sentMessage.edit(embed);

            await message.reply(`Created suggestion with ID ${sentMessage.id}`);

            await new suggestionSchema({
                messageID: sentMessage.id,
                guildID: message.guild.id,
                channelID: guildData.suggestionsChannelID,
                userID: message.author.id,
                content: suggestion,
                active: true,
            }).save();
        } catch (err) {
            this.client.logger.error(`Error while creating suggestion: ${err}`);
        }
    }
};
