const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type :String,required:true,unique:true},
    password:{type :String,required:true},
    email:{type :String,required:true,unique:true},
    nickname:{type :String,required:true},
    role:{type:String,default:"user",required:true},
    gender:{type :String ,default:"male",required:true,},
      assignedChairIds: {
  type: Map,
  of: String,
  default: {}
},
    avatar:{type :String,default:"bob"}
})

const User = mongoose.model('User', userSchema);
module.exports =User;