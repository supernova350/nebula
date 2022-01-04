const SlashCommand = require('../../structures/slashCommand');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            name: 'resume',
            description: 'Resume playback of the current song',
        });
    }

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async run(interaction, args) {}
};
