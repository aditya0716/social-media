const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../model/user');
//implement google startegy
passport.use(new googleStrategy({
        clientID:'1089042956309-d2i8fk5i77ciibh3fq1com660l7g9k2n.apps.googleusercontent.com', //checks for these credentials
        clientSecret:'RBOh97JzKEZrr916HlZO1IKL',
        callbackURL:"http://localhost:8000/signin/google/callback",//if verified then does the callback
    },
    //callback function has the authenticated user profile from google 
    //if user is found then login else create and then login
    function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec((err,user)=>{
            if(err){
                console.log('Error',err);
                return;
            }
            if(user){
                return done(null,user);
            }
            else{
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                },(err,user)=>{
                    if(err){
                        console.log('Error',err);
                        return;
                    }
                    else{
                        return done(null,user);
                    }
                });
            }
        })
    }
));
module.exports=passport;
