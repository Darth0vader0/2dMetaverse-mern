const Space = require('../models/space.model');
const User = require('../models/user.model');

const dotenv = require('dotenv');

dotenv.config();
const { v4: uuidv4 } = require('uuid');

class SpaceController {
    static color = ['bg-blue-600','bg-green-600','bg-purple-600' ,'bg-red-600','bg-pink-600'];
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
            const spaces = await Space.find({$or: [{ creator: id }, { 'members.userId': id }] })
               
            return res.status(200).json({ message: 'Spaces fetched successfully', spaces });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async joinSpaceByCode(req,res){
        const { code } = req.body;
        const { id } = req.user;
        try {
            const space = await Space.findOne({ slug: code.slice(14) });
            if (!space) {
                return res.status(404).json({ message: 'Space not found' });
            }
            const existingMember = space.members.find(member => member.userId.toString() === id);
            if (existingMember) {
                return res.status(400).json({ message: 'Already a member of this space' });
            }
            if (space.members.length >= space.maxMembers) {
                return res.status(400).json({ message: 'Space is full' });
            }
            space.members.push({
                userId: id,
                nickname: req.user.nickname,
                avatarUrl: req.user.avatarUrl,
                joinedAt: Date.now(),
            });
            await space.save();
            return res.status(200).json({ message: 'Joined space successfully', space });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async assignSit(req,res){
        const { spaceId} = req.body;
        const { id } = req.user;
        try {
            const space = await Space.findById(spaceId);
            if (!space) {
                return res.status(404).json({ message: 'Space not found' });
            }
            const chairs = space.mapConfig.chairs;
            const lastChairId = chairs[chairs.length - 1]?.chairId || '0';

            let assignedChairId = 'ch_'
            if(lastChairId == '0'){
                assignedChairId = 'ch_0'
            }else{
                let lastChairNumber = parseInt(lastChairId.slice(3));
                
                assignedChairId = 'ch_'+ (lastChairNumber+1);
                
            }
            // assign the chair to the user and push it to the chairs array
            space.mapConfig.mapId = spaceId;
            await space.save()
            space.mapConfig.chairs.push({
                chairId : assignedChairId,
                isOccupied:true,
                occupiedBy: id
            })
            await space.save();

            const user = await User.findById(id);
            user.assignedChairIds.set(spaceId,assignedChairId)
            await user.save();
            res.status(201).json({success:true , assignedChairId  })


    }catch(e){
        console.log(e);
        res.status(500).json({message : 'enternal server error'});
    }
}
            
}

module.exports = new SpaceController();