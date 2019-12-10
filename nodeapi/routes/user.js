const express = require('express');
const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto,
         addFollower, addFollowing, removeFollower, removeFollowing, findPeople } 
         = require('../controllers/user');
const router = express.Router();
const {requireSignin} = require('../controllers/auth');

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId",requireSignin ,getUser);
router.put("/user/:userId",requireSignin ,updateUser);
router.delete("/user/:userId",requireSignin ,deleteUser);
router.get("/user/photo/:userId", userPhoto);

router.get('/user/findpeople/:userId', requireSignin, findPeople)

router.param("userId", userById);
module.exports = router;