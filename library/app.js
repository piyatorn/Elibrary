// ตัวกลางของโปรเจค
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ระบุตำแหน่ง  
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var booksRouter = require('./routes/books');
var session = require('express-session')
const bcrypt = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/user');

// <=---------------------------- Begin User ----------------------------=>
//User.findOne() เพื่อหา username ใน DB
passport.use(new LocalStrategy((username,password,cb) => {
    User.findOne({username, //username 
      $or:[{
        'is_active':true
      }]
    }, (err, user) => {
      if (err) {
        return cb(err);
      }
      if (!user) {  // ไม่เจอ user
        return cb(null, false);
      }

      if (bcrypt.compareSync(password, user.password)) {
        return cb(null, user); // ตรงกัน
      }
      return cb(null, false)
    })
  })
);


// user เก็บเป็น key
// serializeUser จะเก็บ ค่าไว้ที่ session
passport.serializeUser((user, cb) => {
  cb(null,user._id)  // จะถูกเก็บใน session
});

//ใช้กรณีที่จะดึงค่าจาก session มาหาใน DB ว่าใช่ user คนดีคนเดิมหรือป่าว
passport.deserializeUser((id,cb) => {
  User.findById(id,(err,user) => {
    if (err) {
      return cb(err)
    }
    cb(null, user)  // ถ้าเจอ = ผ่าน
  })
});
// <=---------------------------- End User ----------------------------=>


var app = express();


require('./db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ------------ session login -----------
app.use(
  session({
    secret: 'xxlgxdQLqG',
    resave: false,
    saveUninitialized: false
  })
)
// ------------ end session login -----------


app.use(passport.initialize());
app.use(passport.session());


// นิยามการเข้าถึงผ่าน path อะไร  prefit
app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/books',booksRouter);
//app.use('/register',register);  // ตอนกด submit  Login or Register
//app.use('/login',login);

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
