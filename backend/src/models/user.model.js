const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type :String,required:true,unique:true},
    password:{type :String,required:true},
    email:{type :String,required:true,unique:true},
    nickname:{type :String,required:true},
    avatar:{type :String,default:"red"}
})

const User = mongoose.model('User', userSchema);
module.exports =User;