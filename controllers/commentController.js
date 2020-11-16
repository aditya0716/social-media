const comments=require('../model/comment');
const posts=require('../model/posts');
const commentmailer=require('../mailer/comment_mailer');
const queue=require('../config/kue');
const worker=require('../worker/emailWorker');
const { localsName } = require('ejs');
module.exports.create=async function(req,res)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/signin');
    }
    posts.findById(req.body.post,function(err,post){
        if(post){
            comments.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id,
            },async (err,comment)=>{
                post.comment.push(comment);
                post.save();
                 // commentmailer.newComment(comment,req.user.email);\
               let job=queue.create('emails',comment).save(function(err){
                       if(err){
                           console.log(err);
                           return;
                       }
                       console.log('Enqueue');
                   })
                if(req.xhr){
                    return res.status(200).json({
                        newComment:comment,
                        user:req.user.name,
                    });
                };
                return res.redirect('back');
                
            });

        }
    })
}
module.exports.showComments=async function(req,res){
    // // posts.findById(req.body.post).populate('user')
    // // .exec((err,post)=>{
    // let arr=[];
    // let post=await posts.findById(req.body.id).populate('user');
    // for(let c of post.comment){
    //        let Pcomment=await comments.findById(c).populate('user').populate('posts');
    //        arr.push(Pcomment);
           
    //         // comments.findById(c).populate('user').populate('posts')
    //         // .exec(function(err,Pcomment){
    //         //     arr.push(Pcomment);
    //         //     console.log(arr);
    //         // });
    //     };
    //     console.log(arr);
    //     return res.redirect('back');
    // // // posts.findById(req.body.post)
    // // .populate('user')
    // // .populate({
    // //     path:'comment',
    // //     populate:{
    // //         path:'user',
    // //     }
    // // })
    // // .exec((err,post)=>{
    // //     console.log(post);
    // //     return res.redirect('back');
    // // })
    // posts.findById(req.body.post)
    // .populate('user')
    // .populate({
    //     path:'comment',
    //     populate:{
    //         path:'user'
    //     }
    // })
    // .exec(function(err,posts){
    //     return res.render('post_comment',{
    //         title:'Codeial | Comments',
    //         posts:posts,
    //     });
    // })
    try{
        if(req.query.id){
            console.log('true')
            req.body.post=req.query.id;
        }
        let post=await posts.findById(req.body.post)
                    .populate('user')
                    .populate({
                        path:'comment',
                        populate:{
                            path:'user'
                        }
                    });
        return res.render('post_comment',{
                title:'Codeial | Comments',
                posts:post,
            });
    }catch(err){
        console.error.bind(console,"Error Fired up");
        return;
    }
    
    
}
module.exports.destroy=function(req,res){
    comments.findById(req.query.id,function(err,comment){
        if(comment.user==req.user.id ){
            let postid=comment.post;
            comment.remove();
            posts.findByIdAndUpdate(postid,{$pull:{comment:req.query.id}},function(err,post){
                return res.redirect('/');
            })

        }
        else{
            return res.redirect('back');
        }
    })
}