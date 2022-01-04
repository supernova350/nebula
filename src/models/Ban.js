const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
};

const requiredNumber = {
    type: Number,
    required: true,
};

const banSchema = new mongoose.Schema(
    {
        banID: requiredNumber,
        guildID: requiredString,
        userID: requiredString,
        modID: requiredString,
        reason: requiredString,
    },
    {
        timestamps: true,
    }
);

const Ban = mongoose.model('Ban', banSchema);

module.exports = Ban;
