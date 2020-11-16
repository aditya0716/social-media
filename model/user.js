const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const { strict } = require('assert');
const avatar_path=path.join('/uploads/users/avatar');
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
  
},{
    timestamps:true,
});
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"..",avatar_path));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
userschema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
userschema.statics.avatarPath=avatar_path;
const user=mongoose.model('user',userschema);
module.exports=user;