const passport=require('passport');
const User=require('../model/user');
const LocalStrategy=require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true,
    },
    function(req,email,password,done){
        User.findOne({email:email},(err,user)=>{
            if(err){
                console.log(err);
                return done(err);
            }
            if(!user || user.password!== password){
                req.flash('error','Email or password does not match');
                return done(null,false);
            }
            return done(null,user);
        });
    }
));

passport.serializeUser((user,done)=>{
   return done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if(err){
            console.log(err);
            return done(err);
        }
        return done(null,user);
    })
});
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/signin');
};
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}
module.exports= passport;
