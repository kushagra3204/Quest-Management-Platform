const mongoose = require("mongoose");

const UserActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 

    questsParticipated: [
        {
            questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },
            progress: { 
                type: String, 
                enum: ["started", "in-progress", "completed", "failed", "expired"], 
                default: "started" 
            },
            videoDurationProgress: { type: Number, default: 0 },
            isCompleted: { type: Boolean, default: false },
            startedAt: { type: Date, default: Date.now },
            completedAt: { type: Date },
            updatedAt: { type: Date, default: Date.now }
        }
    ]
});

UserActivitySchema.pre("save", function(next) {
    this.questsParticipated.forEach(quest => {
        quest.updatedAt = new Date();
    });
    next();
});

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);
module.exports = UserActivity;