const Guild = require('../models/Guild');
const User = require('../models/User');
const { Message } = require('discord.js');

module.exports = class Utils {
    constructor(client) {
        this.client = client;
    }

    /**
     *
     * @param {Array} arr
     * @returns
     */

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    /**
     *
     * @param {Number} min
     * @param {Number} max
     */

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     *
     * @param {String} str
     */

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     *
     * @param {guildID} guildID
     */

    async getGuildData(guildID) {
        try {
            let guildData = await Guild.findOne({
                guildID: guildID,
            });

            if (!guildData) {
                guildData = await Guild.create({
                    guildID: guildID,
                });
                await guildData.save();
            }

            return guildData;
        } catch (err) {
            this.client.logger.error(`Error while getting guild data: ${err}`);
        }
    }

    /**
     *
     * @param {String} userID
     * @param {String} guildID
     */

    async getUserData(userID, guildID) {
        try {
            let userData = await User.findOne({
                userID: userID,
                guildID: guildID,
            });

            if (!userData) {
                userData = await User.create({
                    userID: userID,
                    guildID: guildID,
                });
                await userData.save();
            }

            return userData;
        } catch (err) {
            this.client.logger.error(`Error while getting user data: ${err}`);
        }
    }

    /**
     *
     * @param {Message} message
     * @param {String[]} args
     */

    getGuildMember(message, args) {
        const queryMember =
            message.mentions.users.first() || message.author || args[0];

        // No possible guild member
        if (!queryUser) return undefined;

        const guildMember = message.guild.members.cache.find(member => {
            if (
                member.user === queryMember ||
                member.user.id === queryMember ||
                member.user.tag === queryMember
            ) {
                return member;
            }
        });

        // Guild member not found
        if (!guildMember) return null;

        return guildMember;
    }
};
