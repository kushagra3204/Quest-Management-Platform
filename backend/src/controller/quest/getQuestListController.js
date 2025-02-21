const Quest = require("../../models/Quest");
const jwt = require("jsonwebtoken");

const getQuestList = async (req, res) => {
    try {
        const today = new Date();
        
        const activeQuests = await Quest.find({
            $or: [
                { endDate: { $gte: today } },
            ]
        });
        const token = req.cookies['jwt'];
        // console.log(token)
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const modifiedQuests = activeQuests.map(quest => ({
            ...quest.toObject(),
            userNum: userId
        }));

        res.status(200).json(modifiedQuests);
    } catch (error) {
        console.error("Error fetching active quests:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = getQuestList;