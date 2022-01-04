const SlashCommand = require('../../structures/slashCommand');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            name: 'avatar',
            description: "Display a user's avatar",
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description: 'User whose avatar you want to display',
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
        const user =
            interaction.options.get('user')?.member.user ?? interaction.user;

        const embed = new MessageEmbed()
            .setTitle('Avatar')
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }));

        await interaction.followUp({ embeds: [embed] });
    }
};
