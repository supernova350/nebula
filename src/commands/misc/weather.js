const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const weather = require('weather-js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Looks up the weather',
            category: 'Utilities',
            usage: '<location>',
            name: 'weather',
        });
    }

    async run(message, args) {
        const location = args.join(' ');

        if (!location) {
            return this.client.commands.get('help').run(message, ['weather']);
        }

        weather.find(
            {
                search: location,
                degreeType: 'F',
            },
            (err, res) => {
                if (err) {
                    return message.reply("Couldn't find location.");
                }

                const data = res[0];

                if (!data) {
                    return;
                }

                const embed = new MessageEmbed()
                    .setTitle('Weather')
                    .setAuthor(data.location.name)
                    .setThumbnail(data.current.imageUrl)
                    .setColor(message.guild.me.displayHexColor)
                    .addFields(
                        {
                            name: 'Temperature',
                            value: `${data.current.temperature}°F`,
                        },
                        {
                            name: 'Feels Like',
                            value: `${data.current.feelslike}°F`,
                        },
                        {
                            name: 'Sky',
                            value: `${data.current.skytext}`,
                        },
                        {
                            name: 'Humidity',
                            value: `${data.current.humidity}%`,
                        },
                        {
                            name: 'Wind',
                            value: `${data.current.winddisplay}`,
                        }
                    );

                message.channel.send(embed);
            }
        );
    }
};
