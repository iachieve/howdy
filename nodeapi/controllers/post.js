const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getPosts = (req, res) => {
  console.log('getPosts in posts controller called')
  Post.find()
  .populate("postedBy", "_id name")
  .select("_id title body created likes")
  .then(posts => res.json(posts))
  .catch(err => console.log(err));
};

exports.createPost = (req, res)=>{
  console.log('createPost in posts controller called')

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      return res.status(400).json({error: "Image could not be uploaded."})
    }
    let post = new Post(fields);
    // req.profile.hashed_password = undefined;
    // req.profile.salt = undefined;
    // req.profile.__v = undefined;

    post.postedBy = req.profile;

    // debugger;

    if(files.photo){
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result)=> {
      if(err){
        return res.status(400).json({ error: err });
      }
      res.json(result);
    })
  })
};

exports.postsByUser = (req, res)=>{
  console.log('postsByUser in posts controller called')

  Post.find({postedBy: req.profile._id})
  .populate("postedBy", "_id name")
  .select("_id title body created likes")
  .sort("_created: -1")
  .exec((err, posts) => {
    if(err){
      return res.status(400).json({error: err});
    }

    res.json(posts);
  })
};

exports.postById = (req, res, next, id) =>{
  console.log('postById in posts controller called')

  Post.findById(id)
  .populate("postedBy", "_id name")
  .exec((err, post) => {
    if(err){
      return res.status(400).json({error: err});
    }
    req.post = post;
    next();
  })
};

exports.isPoster = (req, res, next) => {
  console.log('isPoster in posts controller called')

  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if(!isPoster){
    return res.status(403).json({error: "User is not authorized"});
  }
  next();
}

exports.updatePost = (req, res, next) => {
  console.log('updatePost in posts controller called')

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      return res.status(400).json({error: "Image could not be uploaded."})
    }
   
    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if(post.photo && files.photo){
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save(err => {
        if (err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action"
            });
        }
        // post.hashed_password = undefined;
        // post.salt = undefined;
        res.json(post);
    });

  })
};

exports.deletePost = (req, res) =>{
  console.log('deletePost in posts controller called')

  let post = req.post;
  post.remove((err, post)=>{
    if(err){
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Post deleted successfully."
    });
  })
}

exports.photo = (req, res) => {
  console.log('photo in posts controller called')

  res.set(('Content-Type', req.post.photo.contentType));
  return res.send(req.post.photo.data);
}



exports.singlePost = (req, res) => {
  console.log('singlePost in posts controller called')

  return res.json(req.post);
};


// like unlike
exports.like = (req, res)=> {
  console.log('in like backend')
  Post.findByIdAndUpdate(req.body.postId, 
    {$push: {likes: req.body.userId}},
    {new: true})
  .exec((err, data) => {
    if(err){
      console.log('like backend error', err)
      return res.status(400).json({ error: err });
    }
    res.json(data);
  })
}

exports.unlike = (req, res)=> {
  console.log('in unlike backend')

  Post.findByIdAndUpdate(req.body.postId, 
    {$pull: {likes: req.body.userId}},
    {new: true})
  .exec((err, data) => {
    if(err){
      console.log('unlike backend error', err)
      return res.status(400).json({ error: err });
    }
    res.json(data);
  })
};

exports.comment = (req, res)=> {
  console.log('in comment')
  Post.findByIdAndUpdate(req.body.postId, 
    {$push: {likes: req.body.userId}},
    {new: true})
  .exec((err, data) => {
    if(err){
      console.log('like backend error', err)
      return res.status(400).json({ error: err });
    }
    res.json(data);
  })
}