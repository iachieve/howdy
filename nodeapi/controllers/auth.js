const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
var expressJwt = require('express-jwt');


exports.signup = async(req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if(userExists)
    return res.status(403).json({
      error: "Email is taken!"
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signup success! please login." });
}

exports.signin = (req, res)=> {
  //steps
  // find the user based on email
  // handle errors if error or no user found
  // generate token with user id and jwt secret key
  // persist the token as 't' in cookie with expiry date
  // return response with user and token to frontend
  const {email, password} = req.body;
  User.findOne({ email }, (err, user)=> {
    if(err || !user) {
      return res.status(401).json({
        error: "email doesn't exist"
       })}
    
    if(!user.authenticate(password)){
      return res.status(401).json({
        error: "email and password doesn't match"
       })
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    res.cookie('t', token, { expire: new Date() + 999 });

    const {_id, name, email} = user;
    // return res.json({token, user: {_id, email, name}});
    return res.json({token, user: {_id, email, name}});

  });


}

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.json({message: 'signout success!'})
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
})