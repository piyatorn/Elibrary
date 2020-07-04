var express = require('express');
var router = express.Router();
const ModelBooks = require('../models/books')

const {check,validationResult} = require('express-validator');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }else{
      return res.redirect('/login');
    }
  }

// จะให้ส่งข้อความอะไร
router.get('/',isLoggedIn, function(req, res, next) {
//router.get('/', function(req, res, next) {
    ModelBooks.getAllBooks(function(err,objBooks){
        if(err) throw err
        res.render("books/index",{data:"รายการหนังสือทั้งหมด",BookList:objBooks,user:req.user});
    });
}); 


router.get('/add',isLoggedIn, function(req, res, next) {
    res.render("books/addForm",{data:"เพิ่มหนังสือ",book:{},user:req.user}) 
}); 

router.get('/delete/:id',isLoggedIn, function(req, res, next) {
    ModelBooks.deleteBook([req.params.id],function(err){
        if(err) throw err
        res.redirect("/books")
    })
}); 

router.get('/edit/:id',isLoggedIn, function(req, res, next) {
    ModelBooks.getBookId([req.params.id],function(err,item){
        if(err) throw err
        res.render("books/editForm",{data:"แก้ไขหนังสือ",book:item,user:req.user}) 
    })
}); 

router.post('/add',isLoggedIn,[
    check('code', 'กรุณากรอกรหัสหนังสือ').not().isEmpty(),
    check('title', 'กรุณากรอกชื่อหนังสือ').not().isEmpty(),
    check('author', 'กรุณากรอกชื่อผู้แต่ง').not().isEmpty(),
    check('total_books','กรุณากรอกจำนวนหนังสือ').not().isEmpty()
], function(req, res, next) {
    //check validate data
    const result = validationResult(req);
    var errors = result.errors;
    for (var key in errors) {
        console.log(errors[key].value);
    }
    if (!result.isEmpty()) {
        // กรณีที่กรอกข้อมูลไม่ครบ
        res.render("books/addForm",{data:"เพิ่มหนังสือ",errors:errors,book:"",user:req.user}) 
    }else{
        DetailBook = new ModelBooks({
            code:req.body.code,
            title:req.body.title,
            author:req.body.author,
            category:req.body.category,
            total_books:req.body.total_books
        })
        ModelBooks.createBook(DetailBook,function(err){
            if(err) console.log(err);
            res.redirect("/books") // บันทึกแล้วถ้าไม่ error ให้กลับไปหน้าแรก
        });
    }
}); 


router.post('/update',isLoggedIn,[
    check('title', 'กรุณากรอกชื่อหนังสือ').not().isEmpty(),
    check('author', 'กรุณากรอกชื่อผู้แต่ง').not().isEmpty(),
    check('total_books','กรุณากรอกจำนวนหนังสือ').not().isEmpty()
], function(req, res, next) {
    //check validate data
    const result = validationResult(req);
    var errors = result.errors;
    for (var key in errors) {
        console.log(errors[key].value);
    }
    if (!result.isEmpty()) {
        // กรณีที่กรอกข้อมูลไม่ครบ
        res.render("books/addForm",{data:"แก้ไขหนังสือ",errors:errors,book:"",user:req.user}) 
    }else{
        DetailBook = new ModelBooks({
            id:req.body.id,
            code:req.body.code,
            title:req.body.title,
            author:req.body.author,
            category:req.body.category,
            total_books:req.body.total_books
        })
        ModelBooks.updateBook(DetailBook,function(err){
            if(err) console.log(err);
            res.redirect("/books") // บันทึกแล้วถ้าไม่ error ให้กลับไปหน้าแรก
        });
    }
}); 

module.exports = router;
