const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['halp'],
            description: 'Displays all the commands in the bot',
            category: 'Utilities',
            usage: '[command]',
            name: 'help',
        });
    }

    async run(message, [command]) {
        const guildData = await this.client.utils.getGuildData(
            message.guild.id
        );
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(
                `Command List`,
                this.client.user.displayAvatarURL({ dynamic: true })
            );

        if (command) {
            const cmd =
                this.client.commands.get(command) ||
                this.client.commands.get(this.client.aliases.get(command));

            if (!cmd) {
                return;
            }

            if (
                cmd.category === 'Owner' &&
                !this.client.config.ownerID.includes(message.author.id)
            ) {
                return;
            }

            embed.setAuthor(
                `${this.client.utils.capitalizeFirstLetter(cmd.name)} Command`,
                this.client.user.displayAvatarURL({ dynamic: true })
            );
            embed.setDescription(
                [
                    `**❯ Aliases:** ${
                        cmd.aliases.length
                            ? cmd.aliases.map(alias => `\`${alias}\``).join(' ')
                            : 'No aliases'
                    }`,
                    `**❯ Description:** ${cmd.description}`,
                    `**❯ Category:** ${cmd.category}`,
                    `**❯ Usage:** ${cmd.getUsage(guildData.prefix)}`,
                ].join('\n')
            );
            return message.channel.send({ embeds: [embed] });
        } else {
            embed.setDescription(
                [
                    `These are all the available commands.`,
                    `The bot's prefix is: \`${guildData.prefix}\`.`,
                    `Command parameters: \`<>\` is required and \`[]\` is optional.`,
                ].join('\n')
            );
            let categories;
            if (!this.client.config.ownerID.includes(message.author.id)) {
                categories = this.client.utils.removeDuplicates(
                    this.client.commands
                        .filter(cmd => cmd.category !== 'Owner')
                        .map(cmd => cmd.category)
                );
            } else {
                categories = this.client.utils.removeDuplicates(
                    this.client.commands.map(cmd => cmd.category)
                );
            }

            for (const category of categories) {
                embed.addField(
                    `**${category.toUpperCase()}**`,
                    this.client.commands
                        .filter(cmd => cmd.category === category)
                        .map(cmd => `\`${cmd.name}\``)
                        .join(' ')
                );
            }
            return message.channel.send({ embeds: [embed] });
        }
    }
};
