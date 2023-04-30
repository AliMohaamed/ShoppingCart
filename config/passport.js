const passport = require('passport');
const localStrategy = require('passport-local').Strategy; //return class
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Cart = require('../models/Cart')

// used to serialize the user for the session
passport.serializeUser((user , done)=>{
    return done(null , user.id); //return id and saved in session
});


passport.deserializeUser((id , done)=>{ //re
    User.find({_id : id} , ('email')) //return email only because i select email
    .then(user => {
        Cart.findById(id )
        .then(cart => {
            if (!cart) { //if not exist cart
                return done(null , user); //will print undefined
            }
            //if exist cart
            user.cart = cart; //here add object cart if user 3ndo cart (in session (not db))
            return done(null , user);
        })
        .catch(err=>{
            if(err) {
                return done(err);
            }
        })
    })
    .catch(err=>{
        return done(err);
    })
});


passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => { //here return done
    User.findOne({ email: email })
        .then(user => {
            // console.log(user);
            if (!user) { //return null
                return done(null, false, req.flash('signinError', 'this user not found'));
            }
            bcrypt.compare(password  , user.password)
            .then(result =>{
                if(result){
                    // not happen error
                    return done(null, user);
                }else{
                    // console.log('Wrong Password');
                    return done(null , false , req.flash('signinError' , 'Wrong Password'));
                }
                
            })
            .catch(err=>{
                if (err) {
                    return done(err);
                }
            })

        })
        .catch(err => {
            if (err) {
                return done(err);
            }
        })
}))


/*
.then(cart => {
            if (!cart) { //if not exist cart
                return done(err , user);
            }
            //if exist cart
            user.cart = cart; //here add object cart if user 3ndo cart
            return done(err , user);
        })
        .catch(err=>{
            if(err) {
                return done(err );
            }
        })
 */

/*
User.findOne({email: email})
.then(user=>{
    if (!user) { //return null
        return done(null , false , req.flash('signinError' , 'this user not found'));
    }
    if( !user.comparePassword(password)){ //return false (password != password in DB) //error here
        return done(null , false , req.flash('signinError' , 'Wrong Password'));
    }
    // not happen error
    return done(null , user);
})
.catch(err=>{
    if (err) {
        return done(err);
    }
})*/

passport.use('local-signup' , new localStrategy({
    usernameField :'email' ,
    passwordField : 'password' ,
    passReqToCallback : true
} , (req , email , password , done)=>{
    User.findOne({email : email})
    .then(user=>{
        if (user) { //return user exist
            return done(null , false , req.flash('signupError' , 'This email already exist'))
        }
        bcrypt.hash(password, 5, (err, hash) => {
            const newUser = new User({
                email : email ,
                password : hash
            });
            newUser.save()
            .then(user=>{
                return done(null , user);
            })
            .catch(err=>{
                if (err) {
                    return done(err);
                }
            })
        })
    })
    .catch(err=>{
        if(err){
            return done(err)
        }
    })
}));

