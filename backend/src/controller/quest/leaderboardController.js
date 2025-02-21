const QuestLeaderboard = require("../../models/QuestLeaderboard");

const showLeaderboard = async (req,res) => {
    try {
        const { questId } = req.params;
        const leaderboardData = await QuestLeaderboard.findOne({ questId }).populate("leaderboard.userId", "username");

        if (!leaderboardData) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }

        res.status(200).json(leaderboardData.leaderboard.slice(0, 10));
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = showLeaderboard