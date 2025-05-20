const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user.model');
dotenv.config();


class AuthMiddlware{
    async verifyToken(req, res, next) {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Forbidden' });
        }
    }

    async checkUser(req, res, next) {
        const { id } = req.user;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = new AuthMiddlware();