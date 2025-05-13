const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class AuthController {
    async signup(req, res) {
        const { username, password, email, nickname } = req.body;
        try {
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, email, nickname });
            if (!newUser) {
                return res.status(500).json({ message: 'User creation failed' });
            }
            await newUser.save();
            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }

    }

    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
            const token = jwt.sign({ id: user._id,
                nickname:user.nickname,
                username
             }, process.env.JWT_SECRET, { expiresIn: '24h' });

            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "None" : "Lax",
                maxAge:  24 * 60 * 60 * 1000, // 1day
                path: "/",
            });
            return res.status(200).json({ message: 'Login successful' });

        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = new AuthController();