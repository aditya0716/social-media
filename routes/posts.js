const express=require('express');
const router=express.Router();
const postsController=require('../controllers/postController');
const commentController=require('../controllers/commentController');
const likeController=require('../controllers/likesController')
const passport = require('passport');
router.post('/',postsController.createPost);
router.post('/create-comment',commentController.create);
router.get('/likes',likeController.toggleLike)
router.get('/delete',passport.checkAuthentication,postsController.destroy);
router.get('/deleteComment',passport.checkAuthentication,commentController.destroy);
module.exports=router;