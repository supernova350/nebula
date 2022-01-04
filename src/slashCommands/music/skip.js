const SlashCommand = require('../../structures/slashCommand');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            name: 'skip',
            description: 'Skip to the next song in the queue',
        });
    }

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async run(interaction, args) {
        let subscription = this.client.subscriptions.get(interaction.guildId);

        if (subscription) {
            // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
            // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
            // will be loaded and played.
            subscription.audioPlayer.stop();
            await interaction.reply('Skipped song!');
        } else {
            await interaction.reply('Not playing in this server!');
        }
    }
};
