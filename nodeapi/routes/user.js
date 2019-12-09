const express = require('express');
const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto } = require('../controllers/user');
const router = express.Router();
const {requireSignin} = require('../controllers/auth');

router.param("userId", userById);

router.get("/users", allUsers);
router.get("/user/:userId",requireSignin ,getUser);
router.put("/user/:userId",requireSignin ,updateUser);
router.delete("/user/:userId",requireSignin ,deleteUser);
router.get("/user/photo/:userId", userPhoto);

module.exports = router;