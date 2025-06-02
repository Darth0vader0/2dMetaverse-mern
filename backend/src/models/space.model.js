const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxMembers: { type: Number, default: 10 },  
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      nickname: { type: String, default: null },
      avatarUrl: { type: String, default: null },
      joinedAt: { type: Date, default: Date.now },
    }
  ],
  color:{type:String,default : "bg-blue-600"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  mapConfig: {
    mapId: String,
    chairs: [
      {
        chairId: String,
        isOccupied: { type: Boolean, default: false },
        occupiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  }
});

const Space = mongoose.model('Space', SpaceSchema);
module.exports = Space;