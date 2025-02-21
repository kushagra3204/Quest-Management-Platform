const User = require('../../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

const login = async (req, res) => {
    const { username__email, password } = req.body;
    let user;

    try {
        if (validateEmail(username__email)) {
            user = await User.findOne({ email: username__email });
        } else {
            user = await User.findOne({ username: username__email });
        }

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.send({ message: "success", role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = login;