const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
};

const string = {
    type: String,
};

const guildSchema = new mongoose.Schema({
    guildID: requiredString,
    settings: {
        prefix: {
            type: String,
            default: '?',
        },
    },
    channels: {
        suggestionChannelID: string,
        starboardChannelID: string,
        memberLogChannelID: string,
        modLogChannelID: string,
    },
});

const Guild = mongoose.model('guild', guildSchema);

module.exports = Guild;
