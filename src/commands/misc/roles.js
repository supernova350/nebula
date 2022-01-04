const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'This shows all roles in a guild',
            category: 'Utilities',
            name: 'roles',
        });
    }

    async run(message) {
        const roles = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(', ');

        if (roles.length > 1024) {
            roles = 'Too many roles to display';
        }
        if (!roles) {
            roles = 'Guild has no roles';
        }
        const embed = new MessageEmbed()
            .setAuthor(message.guild.name)
            .setTitle('Roles')
            .setDescription(roles);
        message.channel.send(embed);
    }
};
