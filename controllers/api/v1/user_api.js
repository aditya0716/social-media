const User=require('../../../model/user');
const jwt=require('jsonwebtoken');
module.exports.createSession=async function(req,res){
   try{
        let user=await User.findOne({email:req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422,{
                message:'Check Email / Password',
            });
        }
        return res.status(200).json({
            message:'SuccessFul SignIn Please Keep Your Token Safe !',
            data:{
                token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'1000000'}),
            }
        })
   }catch(err){
    return res.status(500).json({
        message:'Check Server Connection'
    });
   }
};