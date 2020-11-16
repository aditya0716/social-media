const express=require('express');
const router=express.Router();
const passport=require('passport');
const userController=require('../controllers/userController');
router.get('/',userController.signin);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/signin'}
),userController.createSession);
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate(
    'google',
    {failureRedirect:'/signin'}
),userController.createSession);
module.exports=router;