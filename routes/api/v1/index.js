const express=require('express');
const router=express.Router();
const passport=require('passport');
const postApi=require('../../../controllers/api/v1/posts_api');
const userApi=require('../../../controllers/api/v1/user_api');
const { route } = require('../../signin');
router.get('/',postApi.index)
router.post('/user/create',userApi.createSession);
router.delete('/delete',passport.authenticate('jwt',{session:false}),postApi.destroy)
module.exports=router;