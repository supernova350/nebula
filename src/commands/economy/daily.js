const Command = require('../../structures/Command');
const User = require('../../models/User');
const humanizeDuration = require('humanize-duration');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Claim daily money',
            category: 'Economy',
            name: 'daily',
        });
    }

    async run(message) {
        const userData = await this.client.utils.getUserData(
            message.author.id,
            message.guild.id
        );

        const dailyCommandCooldown = userData.cooldowns.find(
            c => c.command === 'daily'
        );

        const embed = new MessageEmbed().setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
        );

        // No cooldown found, create one!
        if (!dailyCommandCooldown) {
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + ms('1d'));

            // Push cooldown to array
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                },
                {
                    $push: {
                        cooldowns: {
                            command: 'daily',
                            expiry: expiry,
                        },
                    },
                }
            );

            const coinsReceived = this.client.utils.randomIntFromInterval(
                100,
                500
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
                `You received \`${coinsReceived}\` coins from your daily claim!`
            );
            return message.channel.send(embed);
        }

        const now = new Date();

        // Time's up!
        if (dailyCommandCooldown.expiry < now) {
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + ms('1d'));

            // Update cooldown in array
            await userSchema.findOneAndUpdate(
                {
                    userID: message.author.id,
                    guildID: message.guild.id,
                    'cooldowns.command': 'daily',
                },
                {
                    $set: {
                        'cooldowns.$.expiry': expiry,
                    },
                }
            );
        } else if (dailyCommandCooldown.expiry > now) {
            embed.setDescription(
                `You must wait \`${humanizeDuration(
                    dailyCommandCooldown.expiry - now
                )}\` before using your daily claim again!`
            );
            return message.channel.send(embed);
        }

        const coinsReceived = this.client.utils.randomIntFromInterval(100, 500);

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
            `You received \`${coinsReceived}\` coins from your daily claim!`
        );
        return message.channel.send(embed);
    }
};
