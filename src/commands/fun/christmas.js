const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const humanizeDuration = require('humanize-duration');

function timeUntilChristmas() {
    const timeInADay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const thisYear = now.getFullYear();
    let dateOfChristmas = new Date(thisYear, 11, 24, 23);
    if (dateOfChristmas.getTime() < now - timeInADay) {
        dateOfChristmas = new Date(thisYear + 1, 11, 24, 23);
    }

    const timeRemaining = dateOfChristmas.getTime() - now;

    return {
        days: Math.floor(timeRemaining / 1000 / 60 / 60 / 24),
        hours: Math.floor(timeRemaining / 1000 / 60 / 60) % 24,
        minutes: Math.floor(timeRemaining / 1000 / 60) % 60,
        seconds: Math.floor(timeRemaining / 1000) % 60,
    };
}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['xmas'],
            description: 'Time until Christmas',
            category: 'Fun',
            name: 'christmas',
        });
    }

    async run(message, args) {
        const TUC = timeUntilChristmas();

        const embed = new MessageEmbed()
            .setTitle('Time until Christmas')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(
                `${TUC.days}d${TUC.hours}h${TUC.minutes}m${TUC.seconds}s`
            );
        return message.channel.send(embed);
    }
};
