const Space = require('../models/space.model');
const User = require('../models/user.model');

const dotenv = require('dotenv');

dotenv.config();
const { v4: uuidv4 } = require('uuid');

class SpaceController {
    async createSpace(req, res) {
        const { name, maxMembers } = req.body;
        const { id } = req.user;
        try {
            const existingSpace = await Space.findOne
                ({ name, creator: id });
            if (existingSpace) {
                return res.status(400).json({ message: 'Space already exists' });
            }
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const existingSlug = await Space.findOne({ slug });
            if (existingSlug) {
                return res.status(400).json({ message: 'Slug already exists' });
            }

            const newSpace = new Space({
                name,
                slug,
                creator: id,
                maxMembers,
                members: [
                    {
                        userId: id,
                        nickname: req.user.nickname,
                        avatarUrl: req.user.avatarUrl,
                        joinedAt: Date.now(),
                    }
                ],
                mapConfig: {
                    mapId: uuidv4(),
                    chairs: [],
                }
            });
            await newSpace.save();
            return res.status(201).json({ message: 'Space created successfully', space: newSpace });

        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }

    }
}

module.exports = new SpaceController();