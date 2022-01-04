const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
};

const requiredNumber = {
    type: Number,
    required: true,
};

const warnSchema = new mongoose.Schema(
    {
        warnID: requiredNumber,
        guildID: requiredString,
        userID: requiredString,
        modID: requiredString,
        reason: requiredString,
        active: requiredString,
    },
    {
        timestamps: true,
    }
);

const Warn = mongoose.model('Warn', warnSchema);

module.exports = Warn;
