const SlashCommand = require('../../structures/slashCommand');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'Pong!',
        });
    }

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async run(interaction) {
        const embed = new MessageEmbed().setDescription('Pinging...');

        await interaction.reply({ embeds: [embed] });
        const latency = Date.now() - interaction.createdTimestamp;

        embed.setDescription(
            `🏓 Pong!\nClient Latency: \`${latency}ms\`\nAPI Latency: \`${Math.round(
                this.client.ws.ping
            )}ms\``
        );
        await interaction.editReply({ embeds: [embed] });
    }
};
