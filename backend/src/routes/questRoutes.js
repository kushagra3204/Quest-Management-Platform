const express = require("express");
const router = express.Router();
const createQuest = require("../controller/quest/createQuestController");
const getQuestList = require("../controller/quest/getQuestListController");
const showLeaderboard = require("../controller/quest/leaderboardController");
const updateProgress = require("../controller/quest/updateProgressController");
const completedQuest = require("../controller/quest/completedQuestController");

router.post("/update-progress", updateProgress);
router.post("/create", createQuest);
router.get("/active", getQuestList);
router.get("/:questId/leaderboard", showLeaderboard);
router.get("/completed", completedQuest);

module.exports = router;