const posts=require('../model/posts');
const comments=require('../model/comment');
const user = require('../model/user');
const { query } = require('express');
const { post } = require('../routes');
module.exports.createPost=async function(req,res){
    if(!req.isAuthenticated()){
        return res.redirect('/signin');
    }
    // posts.create({
    //     content:req.body.content,
    //     user:req.user._id,
    // },
    // function(err,post){
    //     if(err){
    //         console.error.bind(console,"Error");
    //         return;
    //     }
    //     return res.redirect('/')
    // });
    try{
        let post=await posts.create({
            content:req.body.content,
            user:req.user._id,
        })
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post,
                },
                message:'Post Created !',
                curuser:req.user.name,
            })
        };
        req.flash('success','successfully posted')
        return res.redirect('back');
    }catch(err){
        console.log(err,"Error");
        return;
    }
};
module.exports.viewFeed=async function(req,res){
    if(!req.isAuthenticated()){
        return res.redirect('/signin');
    }
    // user.find({},(err,users)=>{
    //     posts.find({}).populate('user').exec(function(err,posts){
    //         return res.render('feed',{
    //             title:'User | Feed',
    //             post:posts,
    //             users:users,
    //         });
    //     });
    // })
    try {
        let users=await user.find({});
        let post=await posts.find({}).populate('user').populate('like').sort('-createdAt');
        console.log(post)
        return res.render('feed',{
            title:'User | Feed',
            post:post,
            users:users,
        });
    } catch (error) {
        console.log(err,"Error");
        return;
    }

};
module.exports.destroy=async function(req,res){
    // posts.findById(req.query.id,function(err,post){
    //     if(post.user == req.user.id){
    //         post.remove();
    //         comments.deleteMany({post:req.query.id},function(err){
    //             return res.redirect('/profile');
    //         });
    //     }
    //     else{
    //         return res.redirect('back');
    //     }
    // })
  
        try {
            let post=await posts.findById(req.query.id)
            if(post.user == req.user.id){
                post.remove();
                await comments.deleteMany({post:req.query.id});
            }
            let remainingPost=await posts.find({}).populate('user');
            if(req.xhr){
                return res.status(200).json({
                    post:remainingPost,
                });
              }
            req.flash('success','Post Deleted !');
            return res.redirect('/profile');
        } catch (error) {
            console.log('Error',error);
            return res.redirect('back');
        }
    
};
module.exports.detailProfile=function(req,res){
    user.findById(req.query.id,(err,users)=>{
        return res.render('detailUserProfile',{
            title: `${users.name} | profile`,
            user:users,
        })
    })
}
