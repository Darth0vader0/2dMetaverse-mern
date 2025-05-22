const Space = require('../models/space.model');
const User = require('../models/user.model');

const dotenv = require('dotenv');

dotenv.config();
const { v4: uuidv4 } = require('uuid');

class SpaceController {
    static color = ['bg-indigo-600','bg-blue-600','bg-green-600','bg-purple-600', "bg-orange-500" ,"bg-yellow-500"];
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
                // a random color from the array color
                color:SpaceController.color[Math.floor(Math.random()*SpaceController.color.length)],
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
    async getSpace(req, res) {
        const { id } = req.user;
        try {
            const spaces = await Space.find({ creator: id, $or: [{ members: { $elemMatch: { userId: id } } }] })
               
            return res.status(200).json({ message: 'Spaces fetched successfully', spaces });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

}

module.exports = new SpaceController();