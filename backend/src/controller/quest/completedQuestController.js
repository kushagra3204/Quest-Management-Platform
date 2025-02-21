const UserActivity = require("../../models/UserActivity");
const jwt = require("jsonwebtoken");

const completedQuest = async (req, res) => {
    try {
        console.log("Fetching completed quests...");
        
        const token = req.cookies['jwt'];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const userActivity = await UserActivity.findOne({ userId })
            .populate("questsParticipated.questId", "title description bannerImage reward")
            .select("questsParticipated");

        if (!userActivity) {
            return res.status(404).json([]);
        }

        const completedList = userActivity.questsParticipated.filter(q => q.isCompleted);

        res.json(completedList);
    } catch (error) {
        console.error("Error fetching completed quests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = completedQuest;