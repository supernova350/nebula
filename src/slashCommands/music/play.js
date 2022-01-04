const SlashCommand = require('../../structures/slashCommand');
const { CommandInteraction, GuildMember } = require('discord.js');

const Track = require('../../structures/music/track');
const MusicSubscription = require('../../structures/music/subscription');

const {
    AudioPlayerStatus,
    AudioResource,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            name: 'play',
            description: 'Plays a song',
            options: [
                {
                    name: 'song',
                    type: 'STRING',
                    description: 'The URL of the song to play',
                    required: true,
                },
            ],
        });
    }

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    async run(interaction, args) {
        await interaction.defer();
        // Extract the video URL from the command
        const url = interaction.options.get('song').value;

        let subscription = this.client.subscriptions.get(interaction.guildId);

        // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
        // and create a subscription.
        if (!subscription) {
            if (
                interaction.member instanceof GuildMember &&
                interaction.member.voice.channel
            ) {
                const channel = interaction.member.voice.channel;
                subscription = new MusicSubscription(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    })
                );
                subscription.voiceConnection.on('error', console.warn);
                this.client.subscriptions.set(
                    interaction.guildId,
                    subscription
                );
            }
        }

        // If there is no subscription, tell the user they need to join a channel.
        if (!subscription) {
            await interaction.followUp(
                'Join a voice channel and then try that again!'
            );
            return;
        }

        // Make sure the connection is ready before processing the user's request
        try {
            await entersState(
                subscription.voiceConnection,
                VoiceConnectionStatus.Ready,
                20e3
            );
        } catch (error) {
            console.warn(error);
            await interaction.followUp(
                'Failed to join voice channel within 20 seconds, please try again later!'
            );
            return;
        }

        try {
            // Attempt to create a Track from the user's video URL
            const track = await Track.from(url, {
                onStart() {
                    interaction
                        .followUp({ content: 'Now playing!', ephemeral: true })
                        .catch(console.warn);
                },
                onFinish() {
                    interaction
                        .followUp({ content: 'Now finished!', ephemeral: true })
                        .catch(console.warn);
                },
                onError(error) {
                    console.warn(error);
                    interaction
                        .followUp({
                            content: `Error: ${error.message}`,
                            ephemeral: true,
                        })
                        .catch(console.warn);
                },
            });
            // Enqueue the track and reply a success message to the user
            subscription.enqueue(track);
            await interaction.followUp(`Enqueued **${track.title}**`);
        } catch (error) {
            console.warn(error);
            await interaction.reply(
                'Failed to play track, please try again later!'
            );
        }
    }
};
