const Likes=require('../model/likes');
const Post=require('../model/posts');
const Comment=require('../model/comment');
const like = require('../model/likes');
module.exports.toggleLike=async function(req,res){
    console.log(req.query.id)
    console.log(req.query.type)
    try{
        let deleted=false;
        let likeable;
        if(req.query.type=='posts'){
            likeable=await Post.findById(req.query.id).populate('like');
        }
        else{
            likeable=await Comment.findById(req,query.id).populate('like');
        }
        let exsistingLike=await like.findOne({
            likeable:req.query.id,
            user:req.user._id,
            onModel:req.query.type,
        });
        if(exsistingLike){
            likeable.like.pull(exsistingLike);
            likeable.save();
            exsistingLike.remove();
            deleted=true;

        }else{
            let newLike=await like.create({
                user:req.user,
                likeable:req.query.id,
                onModel:req.query.type,
            });
            likeable.like.push(newLike);
            likeable.save();
        }
        return res.status(200).json({
            deleted:deleted,
        })

    }catch(error){
        return res.status(500).json({
            message:'Internal Service Error'
        })
    }
}