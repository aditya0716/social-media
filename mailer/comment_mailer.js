const nodemailer=require('../config/nodemailer');
const user=require('../model/user');
exports.newComment=async (comment)=>{
    let User=await user.findById(comment.user);
    comment.user=User.name
    let htmlString=nodemailer.renderTemplate({comment:comment},'/commentMailer/commentMailer.ejs')
    nodemailer.transporter.sendMail({
        to:User.email,
        subject:'Commented',
        html:htmlString,
    },(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        return;
    })
}