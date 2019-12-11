const express = require('express');
const {getPosts, createPost, postsByUser, singlePost,
      postById, isPoster, deletePost, updatePost, photo,
      like, unlike, comment, uncomment } = require('../controllers/post')
const router = express.Router();
const {createPostValidator} = require('../validators/post');
const { requireSignin } = require('../controllers/auth')
const { userById } = require('../controllers/user');


router.get('/posts', getPosts)

router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.param('userId', userById);
router.param('postId', postById);
router.get('/posts/:postId', singlePost)
router.get("/post/photo/:postId", photo);
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);


module.exports = router