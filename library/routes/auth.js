const express = require('express');
const bcrypt = require('bcrypt');

const passport = require('passport');
const router = express.Router();

// const ModelBooks = require('../models/books');
const User = require('../models/user');

router.post('/register',async  (req, res) => {
  const { username, password,fullname,gender,tel} = req.body
   // validation
   if (!fullname || !username || !password || !gender || !tel) {
    return res.render('register', { title: 'Please try again' })
  }
  const passwordHash = bcrypt.hashSync(password, 10); // จำนวนรอบที่จะ hash
 
  const user = new User({
    fullname,
    username,
    password: passwordHash,
    gender,
    tel,
    is_admin:false,
    is_active:true
  })
  await user.save()

  req.user = user;

  res.redirect('/login')
})


router.post('/login',passport.authenticate('local',{
  successRedirect: '/books',     // ถ้า success จะไป /
  failureRedirect: '/login' // กำหนด ถ้า login fail จะ redirect ไป /login
}),async (req, res) => {
  const { username, password } = req.body;
  return res.redirect("/");
});


// router.post('/login',async (req, res) => {
//   const { username, password } = req.body
//  console.log(req.body);
//    // validation
//   if (!username || !password) {
//     return res.render('login', { message: 'ไม่ถูกต้อง' })
//   }
//   const user = await User.findOne({
//     username
//   })
//   console.log(user);
//   if (user) {
//     const isCorrect = bcrypt.compareSync(password, user.password);
//     console.log(isCorrect);
//     if (isCorrect) {
//       req.session.user = user;
//       console.log("===== redirect books =====");
//       res.redirect('/books');
//       // ModelBooks.getAllBooks(function(err,objBooks){
//       //     if(err) throw err
//       //     return res.render("books/index",{data:"รายชื่อหนังสือทั้งหมด",BookList:objBooks,user});
//       // });
//     } else {
//       return res.render('login', { message: 'รหัสประจำตัวประชาชน หรือ รหัสผ่าน ไม่ถูกต้อง' });
//     }
//   }else{
//     console.log("==========else===========");
//     return res.render('login', { message: 'ไม่พบ รหัสประจำตัวประชาชน' })
//   }
 
// });

module.exports = router;
