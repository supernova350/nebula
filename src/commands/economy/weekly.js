const Command = require('../../structures/Command');
const User = require('../../models/User');
const humanizeDuration = require('humanize-duration');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Claim weekly money',
            category: 'Economy',
            name: 'weekly',
        });
    }

    async run(message) {
        const userData = await this.client.utils.getUserData(
            message.author.id,
            message.guild.id
        );

        const weeklyCommandCooldown = userData.cooldowns.find(
            c => c.command === 'weekly'
        );

        const embed = new MessageEmbed().setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
        );

        // No cooldown found, create one!
        if (!weeklyCommandCooldown) {
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + ms('7d'));

            // Push cooldown to array
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                },
                {
                    $push: {
                        cooldowns: {
                            command: 'weekly',
                            expiry: expiry,
                        },
                    },
                }
            );

            const coinsReceived = this.client.utils.randomIntFromInterval(
                1000,
                10000
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
                `You received \`${coinsReceived}\` coins from your weekly claim!`
            );
            return message.channel.send(embed);
        }

        const now = new Date();

        // Time's up!
        if (weeklyCommandCooldown.expiry < now) {
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + ms('7d'));

            // Update cooldown in array
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                    'cooldowns.command': 'weekly',
                },
                {
                    $set: {
                        'cooldowns.$.expiry': expiry,
                    },
                }
            );
        } else if (weeklyCommandCooldown.expiry > now) {
            embed.setDescription(
                `You must wait \`${humanizeDuration(
                    weeklyCommandCooldown.expiry - now
                )}\` before using your weekly claim again!`
            );
            return message.channel.send(embed);
        }

        const coinsReceived = this.client.utils.randomIntFromInterval(
            1000,
            10000
        );

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
            `You received \`${coinsReceived}\` coins from your weekly claim!`
        );
        return message.channel.send(embed);
    }
};
