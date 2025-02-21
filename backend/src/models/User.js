const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user'
    },
    coins: {
        type: Number,
        default: 0
    },
    badge: {
        type: [String],
        default: ["Rookie"]
    },
    games: {
        type: [{ gameName: String, gameCode: String }],
        default: []
    },
    avatar: {
        type: [String],
        default: ["https://pub-static.fotor.com/assets/projects/pages/7252c2b86395453a836cdd57b13b3d39/600w/fotor-7c742084acd7491aae9923279bdc3218.jpg"]
    },
    experience: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    lastLogin: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);