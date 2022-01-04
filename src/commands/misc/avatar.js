const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['av'],
            description: "Displays a user's avatar",
            category: 'Utilities',
            usage: '[user]',
            name: 'avatar',
        });
    }

    async run(message, args) {
        const avatarUser =
            message.mentions.users.first() || args[0] || message.author;

        if (!avatarUser) {
            return this.client.commands.get('help').run(message, ['avatar']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === avatarUser || m.user.id === avatarUser) {
                return m;
            } else if (
                `${m.user.username}#${m.user.discriminator}` === avatarUser
            ) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        const embed = new MessageEmbed()
            .setTitle('Avatar')
            .setAuthor(
                `${guildUser.user.username}#${guildUser.user.discriminator}`,
                guildUser.user.displayAvatarURL({ dynamic: true })
            )
            .setImage(
                guildUser.user.displayAvatarURL({ dynamic: true, size: 1024 })
            );

        message.channel.send(embed);
    }
};
