const Event = require('../../structures/Event');
const { MessageEmbed } = require('discord.js');
const { Message } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: false,
        });
        this.name = 'messageUpdate';
    }

    /**
     *
     * @param {Message} oldMessage
     * @param {Message} newMessage
     */

    async run(oldMessage, newMessage) {
        if (
            oldMessage.mentions.users.size > 0 &&
            newMessage.mentions.users.size === 0
        ) {
            const embed = new MessageEmbed()
                .setTitle('Ghost Ping Detected (edited)')
                .setAuthor(
                    oldMessage.author.tag,
                    oldMessage.author.displayAvatarURL({
                        dynamic: true,
                    })
                )
                .addFields(
                    {
                        name: 'From',
                        value: oldMessage.content,
                    },
                    {
                        name: 'To',
                        value: newMessage.content,
                    }
                );
            return oldMessage.channel.send(embed);
        }
    }
};
