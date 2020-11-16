const mongoose=require('mongoose');
const postSchema=new mongoose.Schema({
     content:{
         type:String,
         required:true,
     },
     user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user',
     },
     comment:[
         {
             type:mongoose.Schema.Types.ObjectId,
             ref:'Comment',
         }
     ],
     like:[
         {
             type:mongoose.Schema.Types.ObjectId,
             ref:'like',
         }
     ]
    },
    {
        timestamps:true,
    }
);
const posts=mongoose.model('posts',postSchema);
module.exports=posts;