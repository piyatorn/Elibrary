var express = require('express');
var router = express.Router();


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }else{
    return res.redirect('/login');
  }
} 
/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Index' ,user:req.user});
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'ลงทะเบียน',user:'' });   // user ส่ง user ไปเพราะใช้ check
})

router.get('/login', (req, res) => {
  res.render('login', { message: '',user:'' });
})


router.get('/logout',isLoggedIn,(req,res) => {
  req.logout();  // function ของ passport
  res.render('login', { user:'' });
  //res.redirect('/');
});
module.exports = router;
