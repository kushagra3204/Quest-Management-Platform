const mongoose = require("mongoose");

const QuestLeaderboardSchema = new mongoose.Schema({
    questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },
    leaderboard: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            rank: { type: Number, required: true },
            completedAt: { type: Date, required: true }
        }
    ]
});

QuestLeaderboardSchema.pre("save", function(next) {
    this.leaderboard.sort((a, b) => a.rank - b.rank);
    next();
});

const QuestLeaderboard = mongoose.model("QuestLeaderboard", QuestLeaderboardSchema);

module.exports = QuestLeaderboard;