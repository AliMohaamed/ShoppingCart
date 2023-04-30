var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');

const csrf = require('csurf');

router.use(csrf());


/* GET users listing. */
// Start Sign up
router.get('/signup', isNotSignin,function (req, res, next) {
  
  var messagesError = req.flash('signupError');
  // console.log(messagesError); //output is array
  res.render('user/signup' , {messages : messagesError , token:req.csrfToken()});
});


router.post('/signup', [
  // email : name in hbs
  check('email').not().isEmpty().withMessage('Please Enter Your Email'),
  check('email').isEmail().withMessage('Please enter valid email'),
  // password : name in signup.hbs
  check('password').not().isEmpty().withMessage('Please enter your password'),
  check('password').isLength({ min: 5 }).withMessage('please enter password more than 5 character'),
  check('confirm-password').custom((value, { req }) => { //value : bta3t el confirm password w 3mlt call back function 3shan use req.body.password
    if (value !== req.body.password) {
      throw new Error('Password and Confirm Password not matched');
    }
    return true;
  })
], (req, res, next) => {
  // validationResult : result from check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors);
    // console.log(errors.errors);
    let validationMessages = [];

    for(var i =0; i<errors.errors.length; i++){
      validationMessages.push(errors.errors[i].msg)
    }
    // console.log(validationMessages);

    // error in flash :> the same above in get (messagesError)
    req.flash('signupError' , validationMessages[0]);
    // res.redirect : go pager users/signup
    res.redirect('signup') //users/signup(router)


    return; //because exit call back function (not important)
  } 
  next();
  // all this will execute in passport.js
  /*
  bcrypt.hash(req.body.password, 5, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Check if user exist
      // كام ممكن اعملها بالطريقه التانيه اللي موجود في ال rest api (find)
      // and check by array.length < 1
      User.findOne({ email: req.body.email })
        .then(result => {
          if (result) {
            req.flash('error' , 'this email already exist')
            res.redirect('signup')
            return;
          }
          user.save()
            .then(doc => {
              res.send(doc);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
*/

}, passport.authenticate('local-signup' , {
  session : false, //close session because not use serializeUser and deserializeUser
  successRedirect : 'signin' , //profile
  failureRedirect : 'signup' ,
  failureFlash : true
}));

// End Sign Up




// Start Sign in 

router.get('/profile',isSignin , (req,res,next)=>{
  
  if (req.user.cart) { // if exist cart
    totalProducts = req.user.cart.totalQuantity
  }else{
    totalProducts = 0
  }
  res.render('user/profile' , {checkUser : true , checkProfile : true , totalProducts : totalProducts }); //Check User = true because that no body can't access to this page without sign in (req.isAuthenticated()=true)
})

// Start Sign in
router.get('/signin',isNotSignin , (req,res,next)=>{

  var messagesError = req.flash('signinError');
  // console.log(req.csrfToken());
  res.render('user/signin' ,{messages : messagesError , token : req.csrfToken()})
})

// local-signin in passport.js
// عشان تكون فاهم هنا هو هينادي اللوكل سين ان تمام بعد ما يخلصها هيبص بقا علي ال حاجات اللي انت حاططها اللي هي سيليرزيوزر و الديسيليرزيوزر
router.post('/signin' ,[
    // email : name in hbs
    check('email').not().isEmpty().withMessage('Please Enter Your Email'),
    check('email').isEmail().withMessage('Please enter valid email'),
    // password : name in signup.hbs
    check('password').not().isEmpty().withMessage('Please enter your password'),
    check('password').isLength({ min: 5 }).withMessage('please enter password more than 5 character'),
],(req,res,next)=>{


    // validationResult : result from check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors);
      // console.log(errors.errors);
      let validationMessages = [];
  
      for(var i =0; i<errors.errors.length; i++){
        validationMessages.push(errors.errors[i].msg)
      }
      // console.log(validationMessages);
  
      // error in flash :> the same above in get (messagesError)
      req.flash('signinError' , validationMessages[0]);
      // res.redirect : go pager users/signup
      res.redirect('signin') //users/signup(router)
      return; //because exit call back function (not important)
    }

    next();

}, passport.authenticate('local-signin' , {
  successRedirect: 'profile' ,
  failureRedirect : 'signin' ,
  failureFlash : true ,
}));

// End Sign in 

// logout
router.get('/logout',isSignin , (req,res,next)=>{
  // console.log(req.session);
  // console.log(req.isAuthenticated()); //true
  // console.log(req.user);
  req.logout(function(err){
    if (err) { 
      return next(err);
    }
  });//remove authentication (remove passport session) [(here user delete(not DB) from page) (authenticated = false) (All the words that it was doing from signin were deleted)]
  // console.log(req.user);
  // console.log(req.isAuthenticated()); //false
  //all this comment to test 

  res.redirect('/');

});

// Do User Sign in
function isSignin(req ,res,next){
  if (!req.isAuthenticated()) { // return : false
    res.redirect('signin');
    return ;  
  }
  next();//Go to call back function 2
  
}

// Do User not Sign in (دي معموله عشان لو هو مسجل مينفعش اخليه يخش علي صفحه ال sign in or signup)
function isNotSignin(req,res,next){
  if (req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  next();
}

module.exports = router;
