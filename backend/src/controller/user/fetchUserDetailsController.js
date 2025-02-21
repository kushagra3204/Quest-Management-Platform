const User = require("../../models/User");
const UserActivity = require("../../models/UserActivity");
const Quest = require("../../models/Quest");
const QuestLeaderboard = require("../../models/QuestLeaderboard");
const jwt = require("jsonwebtoken");

const fetchUserDetails = async (req, res) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = String(decoded._id);

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const userActivity = await UserActivity.findOne({ userId }).select("questsParticipated");

        let completedQuests = [];
        if (userActivity?.questsParticipated?.length > 0) {
            completedQuests = await Promise.all(
                userActivity.questsParticipated
                    .filter(q => q.isCompleted)
                    .map(async (quest) => {
                        const questDetails = await Quest.findById(quest.questId).select("title description reward");

                        const leaderboardEntry = await QuestLeaderboard.findOne({ questId: quest.questId });
                        let rank = "Not ranked";
                        if (leaderboardEntry) {
                            const userRank = leaderboardEntry.leaderboard.find(entry => String(entry.userId) === userId);
                            if (userRank) {
                                rank = userRank.rank;
                            }
                        }

                        return {
                            title: questDetails?.title || "Unknown Quest",
                            description: questDetails?.description || "No description available",
                            reward: questDetails?.reward?.value || "No reward",
                            completedAt: quest.completedAt,
                            rank: rank
                        };
                    })
            );
        }

        res.json({
            username: user.username,
            avatar: user.avatar,
            coins: user.coins,
            level: user.level,
            experience: user.experience,
            badge: user.badge,
            completedQuests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = fetchUserDetails;