const mongoose = require("mongoose");

const QuestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    gameName: { type: String, required: true },
    companyName: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    challenge: {
        type: {
            type: String,
            enum: ["video", "proofSubmission"],
            required: true
        },
        videoDetails: {
            url: { type: String },
            duration: { type: Number }
        },
        proofDetails: {
            requiresFileUpload: { type: Boolean, default: false },
        }
    },

    reward: {
        type: {
            type: String,
            enum: ["coins", "badge", "gameCode", "avatar"],
            required: true
        },
        value: { type: String }
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    numDays: { type: Number },

    bannerImage: { type: String, required: true },
    logoMedia: { type: String },

}, { timestamps: true });

const Quest = mongoose.model("Quest", QuestSchema);
module.exports = Quest;