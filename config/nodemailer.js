const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:25,//TLS
    secure:false,
    auth:{
        user:'manaschampion26@gmail.com',
        pass:'killkillkillme',
    },
    tls: {
        rejectUnauthorized: false
    }
});
let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,tempelate){
            if(err){
                console.log(err);
                return;
            }
            mailHTML=tempelate;
        }
    )
    return mailHTML;
}
module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate,
}