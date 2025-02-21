const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const user = async (req, res) => {
    try {
        const cookie = req.cookies["jwt"];
        if (!cookie) {
            return res.status(400).json({ message: "unauthenticated" });
        }

        let claims;
        try {
            claims = jwt.verify(cookie, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "unauthenticated" });
        }

        const userdata = await User.findOne({ _id: claims._id });

        if (!userdata) {
            return res.status(401).json({ message: "unauthenticated" });
        }

        const { password, ...data } = userdata.toJSON();
        
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = user;