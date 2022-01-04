const Event = require('../../structures/event');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: false,
        });
        this.name = 'messageDelete';
    }

    async run(message) {
        if (message.mentions.users.size > 0) {
            const embed = new MessageEmbed()
                .setTitle('Ghost Ping Detected (deleted)')
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({
                        dynamic: true,
                        size: 1024,
                    })
                )
                .addFields({
                    name: 'Content',
                    value: message.content,
                });
            return message.channel.send(embed);
        }
    }
};
