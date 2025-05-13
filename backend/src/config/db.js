const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
const connectDb = async ()=>{
    try{
        await mongoose.connect(dbURI);
        console.log('MongoDB connected');
    }catch(e){
        console.error('MongoDB connection error:', e);
    }
}

module.exports = connectDb;