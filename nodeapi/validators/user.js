exports.userSignupValidator = (req,res , next)=>{
  req.check("name", "Name is required").notEmpty();

  req.check("email", "Email must be between 3 to 32 characters.")
  .matches(/.+\@.+\..+/)
  .withMessage('not valid email')
  .isLength({min: 4, max: 2000});

  req.check("password", "password is required").notEmpty();

  req.check("password")
  .isLength({min: 6})
  .withMessage("password must be at least 6 characters")
  .matches(/\d/)
  .withMessage("password must contain a number");

    const errors = req.validationErrors();
    if(errors){
      const firstError = errors.map((err)=> err.msg)[0];
      return res.status(400).json({ error: firstError });
    }
    next();
}