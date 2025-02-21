const User = require("../../models/User")
const UserActivity = require("../../models/UserActivity")
const bcrypt = require("bcrypt")

const signup = async (req,res) => {
    const { username, email, role } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);    
        
        const alreadyUserEmailExists = await User.findOne({ email });
        if(alreadyUserEmailExists) return res.status(400).json({ message: 'User with this email already exists' });

        const alreadyUserNameExists = await User.findOne({ username });
        if(alreadyUserNameExists) return res.status(400).json({ message: 'User with this username already exists' });

        const user = new User({ 
            username: username, 
            email: email, 
            password: hashedPassword, 
            role: role 
        });
        
        const result = await user.save();

        const newUserActivity = new UserActivity({
            userId: user._id,
            questsParticipated: []
        });
        await newUserActivity.save();
        
        // const {password, ...data} = await result.toJSON();
        const { password, ...data } = result.toObject ? result.toObject() : result;
        res.status(201).json({ message: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = signup