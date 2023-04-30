

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


const expressHbs = require('express-handlebars')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/Shopping-cart' ).then(()=>{
  
  console.log('Connected to DB')
}).catch((err)=>{
  console.log("Not Connected to Database ERROR! ", err)
}); 

require('./config/passport'); 

// view engine setup


handlebars.create({
  allowProtoMethodsByDefault: true
});
app.engine('hbs' , expressHbs.engine({defaultLayout : 'layout' , extname : '.hbs' , handlebars : allowInsecurePrototypeAccess(handlebars) , 
helpers :{
  add : function(value){
    return value + 1;
  },
  checkQuantity : function(value){
    if (value <= 1) {
      return true;
    }else{
      return false;
    }
  }
} })) ;
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  // b3ml zy bcrypt masln ll id bta3 el session bta3t el user  
  secret : 'Shopping-cart_?@!' ,
  // de 3ashan lw el user m3mlsh error aw m3mlsh 7aga 8lt msh tt save
  saveUninitialized : false ,
  // عشان لما اليوز يسجل يحفظلي الحاجه بتاعت اليوزر دا عشان لو طلعنا مثلا من الاب هو بيبدا يمسح السيشن لو كانت ب فولس فا لازم اخليها بترو عشان احفظلو الحاجه دي
  resave : true ,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
