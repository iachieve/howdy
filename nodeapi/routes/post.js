const express = require('express');
const {getPosts, createPost, postsByUser, 
      postById, isPoster, deletePost, updatePost } = require('../controllers/post')
const router = express.Router();
const {createPostValidator} = require('../validators/post');
const { requireSignin } = require('../controllers/auth')
const { userById } = require('../controllers/user');


 
router.param('userId', userById);
router.param('postId', postById);
router.get('/posts', getPosts)

router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

module.exports = router