const jwt = require("jsonwebtoken");
const Quest = require("../../models/Quest");
const QuestLeaderboard = require("../../models/QuestLeaderboard");

const createQuest = async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const {
            gameName,
            companyName,
            title,
            description,
            challengeType,
            videoUrl,
            videoDuration,
            requiresFileUpload,
            rewardType,
            rewardValue,
            startDate,
            endDate,
            numDays,
            bannerImage,
            logoMedia
        } = req.body;

        let challenge = { type: challengeType };

        if (challengeType === "video") {
            challenge.videoDetails = { url: videoUrl, duration: videoDuration };
        } else if (challengeType === "proofSubmission") {
            challenge.proofDetails = { requiresFileUpload };
        }

        const newQuest = new Quest({
            userId,
            gameName,
            companyName,
            title,
            description,
            challenge,
            reward: { type: rewardType, value: rewardValue },
            startDate,
            endDate,
            numDays,
            bannerImage,
            logoMedia
        });
        await newQuest.save();

        const newQuestLeaderboard = new QuestLeaderboard({
            questId: newQuest._id,
            leaderboard: []
        });
        await newQuestLeaderboard.save();

        res.status(201).json({ success: true, message: "Quest created successfully", quest: newQuest });
    } catch (error) {
        console.error("Error creating quest:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

module.exports = createQuest;