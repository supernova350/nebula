const Event = require('../../structures/event');
const Mute = require('../../models/Mute');
const { GuildMember } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: false,
        });
        this.name = 'guildMemberAdd';
    }

    /**
     *
     * @param {GuildMember} member
     */

    async run(member) {
        const currentMute = await Mute.findOne({
            guildID: member.guild.id,
            userID: member.id,
            active: true,
        });

        if (currentMute) {
            const mutedRole = (await message.guild.roles.fetch()).find(
                role => role.name.toLowerCase() === 'muted'
            );

            if (mutedRole) {
                try {
                    await member.roles.add(mutedRole);
                } catch (err) {}
            }
        }
    }
};
