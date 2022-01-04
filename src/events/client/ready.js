const Event = require('../../structures/event');
const Mute = require('../../models/Mute');
const Ban = require('../../models/Ban');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: true,
        });
        this.name = 'ready';
    }

    async run() {
        await this.client.loadInteractions();

        const checkMutes = async () => {
            const now = new Date();

            const filter = {
                expiry: {
                    $lt: now,
                },
                active: true,
            };

            const toUnmute = await Mute.find(filter);

            if (toUnmute && toUnmute.length) {
                for (const mute of toUnmute) {
                    const guild = this.client.guilds.cache.get(mute.guildID);
                    const member = (await guild.members.fetch()).get(
                        mute.userID
                    );

                    const mutedRole = guild.roles.cache.find(r => {
                        return r.name.toLowerCase() === 'muted';
                    });

                    if (
                        mutedRole &&
                        member.roles.cache.find(m => m === mutedRole)
                    ) {
                        member.roles.remove(mutedRole);
                    }
                }
            }

            await Mute.updateMany(filter, {
                active: false,
            });

            setTimeout(checkMutes, 1000 * 1);
        };

        checkMutes();

        const checkBans = async () => {
            const now = new Date();

            const filter = {
                expiry: {
                    $lt: now,
                },
                active: true,
            };

            const toUnban = await Ban.find(filter);

            if (toUnban && toUnban.length) {
                for (const ban of toUnban) {
                    const guild = this.client.guilds.cache.get(ban.guildID);

                    const bans = await guild.fetchBans();
                    if (bans.size === 0) {
                        break;
                    }

                    const foundBan = bans.find(b => b.user.id == ban.userID);

                    guild.members.unban(foundBan.user);
                }
            }

            await Mute.updateMany(filter, {
                active: false,
            });

            setTimeout(checkBans, 1000 * 1);
        };

        checkBans();

        const checkMessages = async () => {
            const intervalMessages = await intervalMessageSchema.find();

            for (const intervalMessage of intervalMessages) {
                const now = new Date();
                if (
                    now - intervalMessage.lastMessage >=
                    intervalMessage.interval
                ) {
                    const channel = await this.client.channels.fetch(
                        intervalMessage.channelID
                    );
                    await channel.send(intervalMessage.content);

                    intervalMessage.lastMessage = now;

                    await intervalMessage.save();
                }
            }

            setTimeout(checkMessages, 1000);
        };

        //checkMessages();

        this.client.logger.ready(`Logged in as ${this.client.user.tag}!`);
    }
};
