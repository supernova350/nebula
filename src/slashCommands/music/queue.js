const SlashCommand = require('../../structures/slashCommand');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            name: 'queue',
            description: 'Displays the music queue',
        });
    }

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async run(interaction, args) {}
};
