const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const moment = require('moment');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['ui'],
            description: 'Display info about a user',
            category: 'Utilities',
            usage: '[user]',
            name: 'user-info',
        });
    }

    async run(message, args) {
        const query =
            message.mentions.users.first() || args[0] || message.author;

        if (!query) {
            return this.client.commands.get('help').run(message, ['avatar']);
        }

        const guildUser = message.guild.members.cache.find(m => {
            if (m.user === query || m.user.id === query) {
                return m;
            } else if (`${m.user.username}#${m.user.discriminator}` === query) {
                return m;
            }
        });

        if (!guildUser) {
            return message.reply('No user found.');
        }

        const embed = new MessageEmbed()
            .setTitle('User Info')
            .setAuthor(
                `${guildUser.user.username}#${guildUser.user.discriminator}`,
                guildUser.user.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(
                guildUser.user.displayAvatarURL({ dynamic: true, size: 1024 })
            )
            .addFields(
                {
                    name: 'Origin',
                    value: moment(guildUser.user.createdTimestamp).format(
                        'lll'
                    ),
                },
                {
                    name: 'Joined',
                    value: moment(guildUser.joinedAt).format('lll'),
                },
                {
                    name: 'Roles',
                    value: guildUser.roles.cache.map(r => r).join(' '),
                }
            );
        message.channel.send(embed);
    }
};
