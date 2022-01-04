const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
};

const suggestionSchema = new mongoose.Schema(
    {
        messageID: requiredString,
        guildID: requiredString,
        channelID: requiredString,
        userID: requiredString,
        content: requiredString,
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
