const Event = require('../../structures/event');
const ms = require('ms');
const { Message } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: false,
        });
        this.name = 'messageCreate';
    }

    /**
     *
     * @param {Message} message
     */

    async run(message) {
        const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}>`);

        if (!message.guild || message.author.bot) return;

        const guildData = await this.client.utils.getGuildData(
            message.guild.id
        );
        const userData = await this.client.utils.getUserData(
            message.author.id,
            message.guild.id
        );

        const now = new Date();
        if (now - userData.leveling.lastMessage >= ms('1m')) {
            const randomXP = this.client.utils.randomIntFromInterval(15, 25);
            userData.leveling.lastMessage = now;
            userData.leveling.xp += randomXP;
            const xpToNext =
                5 * Math.pow(userData.leveling.level, 2) +
                5 * userData.leveling.level +
                100;
            if (userData.leveling.xp >= xpToNext) {
                userData.leveling.level++;
                userData.leveling.xp -= xpToNext;
                message.reply(
                    `Leveled up to level ${userData.leveling.level}!`
                );
            }

            userData.save().catch(this.client.logger.error);
        }

        if (message.content.match(mentionRegex)) {
            message.channel.send(
                `My prefix for ${message.guild.name} is \`${guildData.prefix}\`.`
            );
        }

        const prefix = message.content.match(mentionRegexPrefix)
            ? message.content.match(mentionRegexPrefix)[0]
            : guildData.prefix;

        if (!message.content.startsWith(prefix)) return;

        const [cmd, ...args] = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/);

        const command =
            this.client.commands.get(cmd.toLowerCase()) ||
            this.client.commands.get(
                this.client.aliases.get(cmd.toLowerCase())
            );

        if (command) {
            let allowed = false;
            if (command.permissions) {
                for (const perm of command.permissions) {
                    if (message.member.hasPermission(perm)) {
                        allowed = true;
                        break;
                    }
                }
            }

            // if command is an Owner command and user is not an owner
            if (
                command.category === 'Owner' &&
                !this.client.config.ownerID.includes(message.author.id)
            ) {
                return message.reply('nice try (1).');
            }

            // if invalid perms, has perms, and user is not an owner
            if (
                !allowed &&
                command.permissions.length &&
                !this.client.config.ownerID.includes(message.author.id)
            ) {
                return message.reply('nice try (2).');
            }

            try {
                command.run(message, args);
            } catch (err) {
                this.client.logger.error(
                    `Failed to run command, error: ${err}`
                );
            }
        }
    }
};
