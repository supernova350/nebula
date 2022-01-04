const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true,
};

const userSchema = new mongoose.Schema({
    userID: requiredString,
    guildID: requiredString,
    cooldowns: {
        type: Array,
        default: [],
    },
    economy: {
        coins: {
            type: Number,
            default: 1000,
        },
        bank: {
            type: Number,
            default: 1000,
        },
    },
    leveling: {
        lastMessage: {
            type: Date,
            default: new Date(),
        },
        level: {
            type: Number,
            default: 1,
        },
        xp: {
            type: Number,
            default: 0,
        },
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
