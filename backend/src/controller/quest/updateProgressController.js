const Quest = require("../../models/Quest");
const User = require("../../models/User");
const QuestLeaderboard = require("../../models/QuestLeaderboard");
const UserActivity = require("../../models/UserActivity");
const jwt = require("jsonwebtoken");

const updateProgress = async (req, res) => {
    try {
        const { questId } = req.body;

        if (!questId) {
            return res.status(400).json({ success: false, message: "Bad Request: questId is required" });
        }

        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = String(decoded._id);
        const questIdStr = String(questId);

        const quest = await Quest.findById(questIdStr);
        if (!quest) {
            return res.status(404).json({ success: false, message: "Quest not found" });
        }

        let userActivity = await UserActivity.findOneAndUpdate(
            { userId },
            { $setOnInsert: { userId, questsParticipated: [] } },
            { upsert: true, new: true }
        );

        // Check if the user has already completed this quest
        const existingQuestIndex = userActivity.questsParticipated.findIndex(q => String(q.questId) === questIdStr);

        if (existingQuestIndex === -1) {
            userActivity.questsParticipated.push({
                questId: questIdStr,
                progress: "completed",
                isCompleted: true,
                completedAt: new Date(),
            });
        } else {
            userActivity.questsParticipated[existingQuestIndex].progress = "completed";
            userActivity.questsParticipated[existingQuestIndex].isCompleted = true;
            userActivity.questsParticipated[existingQuestIndex].completedAt = new Date();
        }

        await userActivity.save();

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Process the rewards based on quest details
        if (quest.reward.type === "coins") {
            user.coins += parseInt(quest.reward.value);
        } else if (quest.reward.type === "badge") {
            if (!user.badges.includes(quest.reward.value)) {
                user.badges.push(quest.reward.value);
            }
        } else if (quest.reward.type === "gameCode") {
            const gameCodeEntry = { gameName: quest.gameName, gameCode: quest.reward.value };
            if (!user.games.some(game => game.gameCode === quest.reward.value)) {
                user.games.push(gameCodeEntry);
            }
        } else if (quest.reward.type === "avatar") {
            if (!user.avatar.includes(quest.reward.value)) {
                user.avatar.push(quest.reward.value);
            }
        }

        await user.save();

        // Fetch or create leaderboard entry for the quest
        let leaderboardEntry = await QuestLeaderboard.findOneAndUpdate(
            { questId: questIdStr },
            { $setOnInsert: { questId: questIdStr, leaderboard: [] } },
            { upsert: true, new: true }
        );

        if (!leaderboardEntry.leaderboard.some(entry => String(entry.userId) === userId)) {
            leaderboardEntry.leaderboard.push({ userId, completedAt: new Date() });

            // Sort leaderboard based on completion time
            leaderboardEntry.leaderboard.sort((a, b) => a.completedAt - b.completedAt);

            leaderboardEntry.leaderboard.forEach((entry, index) => {
                entry.rank = index + 1;
            });

            await leaderboardEntry.save();
        }

        res.status(200).json({ success: true, message: "Quest progress updated and rewards granted successfully" });
    } catch (error) {
        console.error("Error updating quest progress:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = updateProgress;