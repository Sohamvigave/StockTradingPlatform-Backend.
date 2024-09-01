const User = require("../model/userModel");
const { createSecretToken } = require("../Util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exist" });
        }
        const user = await User.create({ email, password, username, createdAt });
        const token = createSecretToken(user._id);
        // console.log(token);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", succes: true, user });
        next();
    } catch (error) {
        console.error(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect email or password' });
        }
        const auth = bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: 'Incorrect email or password' });
        }
        res.cookie("token", user.id, {
            withCredentials: true,
            httpOnly: false,
        });
        // console.log(req.cookies);
        res.json({ message: 'User logged in successful', success: true });
        // next();
    } catch (error) {
        console.error(error);
    }
}
