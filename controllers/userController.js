const user=require('../model/user');
const posts=require('../model/posts');
const fs=require('fs');
const path=require('path');
module.exports.homepage=function(req,res){
    return res.render('home',{
        title:'Codeial | Home',
    });
};
module.exports.signin=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    return res.render('user_signin',{
        title:'Codeial | User-SignIn',
    });
};
module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    return res.render('user_signup',{
        title:'Codeial | User-SignUp',
    });
};
module.exports.create=function(req,res){
    if(req.body.password!==req.body.reenterPassword){
        req.flash('error','Password does not match');
        return res.redirect('back');
    }
    // user.findOne({email:req.body.email},(err,userdata)=>{
    //     if(err){console.error.bind(console,'error');return;};
    //     if(!userdata){
    //         user.create(req.body,(err,newuser)=>{
    //             req.flash('success','SignUp Successful');
    //             return res.redirect('/signin');
    //         });
    //     }
    //     else{
    //         req.flash('error','Email Already in use');
    //         return res.redirect('back');
    //     }
    // });
    user.uploadedAvatar(req,res,(err)=>{
        if(req.body.password!==req.body.reenterPassword){
            req.flash('error','Password does not match');
            return res.redirect('back');
        }
        user.findOne({email:req.body.email},(err,userData)=>{
            if(!userData){
                 user.create({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                },(err,newuser)=>{
                    if(req.file){
                        newuser.avatar=user.avatarPath+'/'+req.file.filename;
                        newuser.save();
                    }
                    req.flash('success','SignUp Successful');
                    return res.redirect('/signin');
                })
            }else{
                req.flash('error','Email Already in use');
                return res.redirect('back');  
            }
        })
    })
};
module.exports.createSession=function(req,res){
    req.flash('success','Logged In Successfully')
    return res.redirect('/profile');
};
module.exports.profile=async function(req,res){
    user.find({},(err,users)=>{
        posts.find({user:req.user._id},(err,post)=>{
            return res.render('profile',{
                    title:'User | profile',
                    post:post,
                    users:users,
                });
        });
    })

};
module.exports.updateProfile=function(req,res){
    if(req.user.id == req.query.id){
        user.uploadedAvatar(req,res,async function(err){
            let curUser=await user.findById(req.query.id);
            if(curUser.avatar){
                if(fs.existsSync(path.join(__dirname,'..',curUser.avatar))){
                    fs.unlinkSync(path.join(__dirname,'..',curUser.avatar));
                }
            }
            curUser.avatar=user.avatarPath+'/'+req.file.filename;
            curUser.save();
            res.redirect('back');
        })
    }
}
module.exports.signout=function(req,res){
    req.logOut();
    req.flash('success','Logged Out Successfuly');
    return res.redirect('/signin');
};