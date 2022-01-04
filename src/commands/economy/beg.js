const Command = require('../../structures/Command');
const User = require('../../models/User');
const humanizeDuration = require('humanize-duration');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Claim beg money',
            category: 'Economy',
            name: 'beg',
        });
    }

    async run(message) {
        const userData = await this.client.utils.getUserData(
            message.author.id,
            message.guild.id
        );
        const begCommandCooldown = userData.cooldowns.find(
            c => c.command === 'beg'
        );

        const embed = new MessageEmbed().setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
        );

        if (!begCommandCooldown) {
            const expiry = new Date();
            expiry.setTime(
                expiry.getTime() +
                    this.client.utils.randomIntFromInterval(5, 120) * 60 * 1000
            ); // 5 - 120 minutes

            // Push cooldown to array
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                },
                {
                    $push: {
                        cooldowns: {
                            command: 'beg',
                            expiry: expiry,
                        },
                    },
                }
            );

            const coinsReceived = this.client.utils.randomIntFromInterval(
                5,
                120
            );

            // Add coins to balance
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                },
                {
                    $inc: {
                        'economy.coins': coinsReceived,
                    },
                }
            );

            embed.setDescription(
                `You begged and got \`${coinsReceived}\` coins!`
            );
            return message.channel.send(embed);
        }

        const now = new Date();

        // Time's up!
        if (begCommandCooldown.expiry < now) {
            const expiry = new Date();
            expiry.setTime(
                expiry.getTime() +
                    this.client.utils.randomIntFromInterval(5, 120) * 60 * 1000
            ); // 5 - 120 minutes

            // Update cooldown in array
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                    'cooldowns.command': 'beg',
                },
                {
                    $set: {
                        'cooldowns.$.expiry': expiry,
                    },
                }
            );
        } else if (begCommandCooldown.expiry > now) {
            embed.setDescription(
                `You must wait \`${humanizeDuration(
                    begCommandCooldown.expiry - now
                )}\` before begging for coins again!`
            );
            return message.channel.send(embed);
        }

        const coinsReceived = this.client.utils.randomIntFromInterval(5, 120);

        await userSchema.findOneAndUpdate(
            {
                userID: message.author.id,
                guildID: message.guild.id,
            },
            {
                $inc: {
                    'economy.coins': coinsReceived,
                },
            }
        );

        embed.setDescription(`You begged and got \`${coinsReceived}\` coins!`);
        return message.channel.send(embed);
    }
};
