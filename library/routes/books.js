var express = require('express');
var router = express.Router();
const ModelBooks = require('../models/books')

// จะให้ส่งข้อความอะไร
router.get('/', function(req, res, next) {
    ModelBooks.getAllBooks(function(err,objBooks){
        if(err) throw err
        res.render("books/index",{data:"รายชื่อหนังสือทั้งหมด",BookList:objBooks});
    });
}); 

router.get('/add', function(req, res, next) {
    res.render("books/addForm",{data:"เพิ่มหนังสือ"}) 
}); 

router.post('/add', function(req, res, next) {
    DetailBook = new ModelBooks({
        title:req.body.title,
        author:req.body.author,
        category:req.body.category
    })

    ModelBooks.createBook(DetailBook,function(err){
        if(err) console.log(err);
        res.redirect("/") // บันทึกแล้วถ้าไม่ error ให้กลับไปหน้าแรก
    });
}); 

module.exports = router;
