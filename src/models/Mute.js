const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
};

const requiredNumber = {
    type: Number,
    required: true,
};

const muteSchema = new mongoose.Schema(
    {
        muteID: requiredNumber,
        guildID: requiredString,
        userID: requiredString,
        modID: requiredString,
        reason: requiredString,
        expiry: {
            type: Date,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Mute = mongoose.model('Mute', muteSchema);

module.exports = Mute;
