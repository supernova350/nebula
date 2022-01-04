const { MessageEmbed, MessageAttachment } = require('discord.js');
const Command = require('../../structures/Command');
const Captcha = require('@haileybot/captcha-generator');

function verifyHuman(message) {
    const captcha = new Captcha();
    const attachment = new MessageAttachment(captcha.PNGStream, 'captcha.png');
    message.channel.send(
        '**Enter the text shown in the image below:**',
        attachment
    );

    let attempts = 3;

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter);

    collector.on('collect', m => {
        if (m.content.toUpperCase() === captcha.value) {
            message.channel.send('Successfully verified!');
            collector.stop();
        } else {
            attempts--;
            if (attempts > 0) {
                message.channel.send(
                    `Invalid code! You have ${attempts} attempt${
                        attempts === 1 ? '' : 's'
                    } left.`
                );
            } else {
                message.channel.send('Failed verification (out of attempts).');
                collector.stop();
            }
        }
    });
}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['cap'],
            description: 'Generates a captcha',
            category: 'Fun',
            name: 'captcha',
        });
    }

    async run(message, args) {
        verifyHuman(message);
    }
};
