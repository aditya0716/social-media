const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/passUserDB',{useNewUrlParser:true});
const db=mongoose.connection;
db.on('error',console.error.bind(console,'error'));
db.once('open',()=>{
    console.log('successfully Connected to database');
});
module.exports= db;
