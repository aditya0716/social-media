const Post=require('../../../model/posts');
const comments=require('../../../model/comment');
const e = require('express');
module.exports.index=async function(req,res){
    let post=await Post.find({}).populate('user').sort('-createdAt');
    return res.status(200).json({
        message:'Personal Api',
        data:post,
    })
}
module.exports.destroy=async function(req,res){
    try {
            let post=await Post.findById(req.query.id)
            if(post.user == req.user.id){
                post.remove();
                await comments.deleteMany({post:req.query.id});
                return res.status(200).json({
                    message:'Success Deletion',
                })
            }
            else{
                return res.status(500).json({
                    message:'Unauth',
                })
            }
            
      
       
    } catch (error) {
        return res.status(500).json({
            message:'Check Server Connection'
        })
    }
}