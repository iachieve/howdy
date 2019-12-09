exports.createPostValidator = (req, res, next) => {
  req.check('title', "Write a title").notEmpty();
  req.check('title', "title must be between 4 to 150 characters").isLength({
    min: 4, max:150
  });

  req.check('body', "Write a body").notEmpty();
  req.check('body', "body must be between 4 to 150 characters").isLength({
    min: 4, max:150
  });

  // check for errors
  const errors = req.validationErrors();
  // if errors show the first one as they happen/appear
  if(errors){
    const firstError = errors.map((err)=> err.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware
  next();
}