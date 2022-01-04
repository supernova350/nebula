const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const suggestionSchema = require('../../models/suggestion');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Denies a suggestion',
            category: 'Utilities',
            usage: '<suggestion ID>',
            name: 'deny-suggestion',
            permissions: ['MANAGE_MESSAGES', 'MANAGE_GUILD', 'ADMINISTRATOR'],
        });
    }

    async run(message, args) {
        const suggestionMessageID = args[0];

        if (!suggestionMessageID || isNaN(suggestionMessageID)) {
            return this.client.commands
                .get('help')
                .run(message, ['deny-suggestion']);
        }

        const suggestion = await suggestionSchema.findOneAndUpdate(
            {
                messageID: suggestionMessageID,
                guildID: message.guild.id,
            },
            {
                active: false,
            }
        );

        if (!suggestion) {
            return message.reply('No suggestion found');
        }

        if (!suggestion.active) {
            return message.reply('Suggestion not active');
        }

        const guild = await this.client.guilds.fetch(suggestion.guildID);
        const channel = guild.channels.cache.get(suggestion.channelID);
        const suggestionMessage = await channel.messages.fetch(
            suggestion.messageID
        );

        const suggestee = this.client.users.cache.get(suggestion.userID);

        const embed = new MessageEmbed()
            .setTitle('Suggestion')
            .setAuthor(
                suggestee.tag,
                suggestee.displayAvatarURL({ dynamic: true })
            )
            .setDescription(`DENIED SUGGESTION -- ${suggestion.content}`)
            .setFooter(`ID: ${suggestion.messageID}`);

        await suggestionMessage.edit(embed);
        await message.reply(`Denied suggestion ID ${suggestion.messageID}`);
    }
};
