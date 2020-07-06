var express = require('express');
var router = express.Router();
const ModelBooks = require('../models/books')
const ModelBorrow = require('../models/borrow')
const ModelCategory = require('../models/category')
const {check,validationResult} = require('express-validator');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }else{
      return res.redirect('/login');
    }
}

// -------------------------------- Begin get --------------------------------

// ตอนกดเข้าหน้าหลัก books
router.get('/',isLoggedIn, function(req, res, next) {

    // ส่งข้อมูลหนังสือทั้งหมดไปแสดงผ่านตัวแปร objBooks
    ModelBooks.getAllBooks(function(err,objBooks){
        if(err) throw err
        res.render("books/index",{
            data:"รายการหนังสือทั้งหมด",
            BookList:objBooks,
            user:req.user,
            bookshelf:req.session.bookshelf
        });
    });

    // // ModelBorrow.aggregate([
    // //     {
    // //         $group: {
    // //           _id: "$_id",
    // //           totalqty: { $sum: "$book_id.qty"}
    // //         }
    // //     }],
    // //     function(err,data) {
    // //       if(err) throw err;
    // //       console.log(JSON.stringify(data, undefined, 2 ) );
              
    // //     }
    // //   );
    

    // // ModelBooks.getAllBooks(function(err,objBooks){
    // //     if(err) throw err
    // //     ModelBorrow.getAllBorrow(function(err,objTran){
    // //         console.log(objTran);
            
    // //         if(req.user == objTran.user_id){
    // //             console.log("============= IF =============");
    // //         }

    // //         objTran.forEach(function(item) {
    // //             bookshelf[book_id] = {
    // //                 id: item._id,
    // //                 title: item.title,
    // //                 code: item.code,
    // //                 author: item.author,
    // //                 category: item.category,
    // //                 qty: 1
    // //             }
    // //         });

    // //         if(err) throw err
    // //         res.render("books/index",{data:"รายการหนังสือทั้งหมด",
    // //                                   BookList:objBooks,
    // //                                   user:req.user,
    // //                                   bookshelf:req.session.bookshelf,
    // //                                   booksBorrow:objTran
    // //                                 });
    // //     });
    // // });

}); 

// ตอนกดเพิ่มหนังสือ 
router.get('/add',isLoggedIn, function(req, res, next) {
    var txtTitle = "กรุณาติดต่อเจ้าหน้าที่";
    if(req.user.is_admin){
        txtTitle = "เพิ่มหนังสือ";
    } 
    ModelCategory.getAllCategory(function(err,objCategory){
        res.render("books/addForm",{
            data:txtTitle,
            book:{},
            CategoryList:objCategory,
            user:req.user,
            bookshelf:req.session.bookshelf
        }) 
    });
}); 

// ตอนกดเพิ่มหมวดหมู่
router.get('/addCategory',isLoggedIn, function(req, res, next) {
    var txtTitle = "กรุณาติดต่อเจ้าหน้าที่";
    if(req.user.is_admin){
        txtTitle = "รายการหมวดหมู่";
    }
    ModelCategory.getAllCategory(function(err,objCategory){
        if(err) throw err
        res.render("books/addCategory",{
            data:txtTitle,
            CategoryList:objCategory,
            Detail:"",
            user:req.user,
            Is_Edit:false
        });
    });
}); 

// ตอนกดแก้ไขหมวดหมู่ มีโยน id มาแล้วนำไปดึงข้อมูล getCategoryId แล้วส่งกลับไปแสดงที่ตัวแปร item
router.get('/editCategory/:id',isLoggedIn, function(req, res, next) {
    ModelCategory.getAllCategory(function(err,objCategory){
        ModelCategory.getCategoryId([req.params.id],function(err,item){
            if(err) throw err
            res.render("books/addCategory",{
                data:"รายการหมวดหมู่",
                CategoryList:objCategory,
                Detail:item,
                user:req.user,
                Is_Edit:true
            }) 
        })
    });
}); 

// ตอนกด ลบข้อมูลหมวดหมู่
router.get('/deleteCategory/:id',isLoggedIn, function(req, res, next) {
    ModelCategory.deleteCategory([req.params.id],function(err){
        if(err) throw err
        res.redirect("/books/addCategory")
    })
}); 


// ตอนกด ลบหนังสือ
router.get('/delete/:id',isLoggedIn, function(req, res, next) {
    ModelBooks.deleteBook([req.params.id],function(err){
        if(err) throw err
        res.redirect("/books")
    })
}); 


// ตอนกด คืนหนังสือ 
router.get('/remove/:id',isLoggedIn, function(req, res, next) {
    var book_id = req.body.book_id;
    req.session.bookshelf = req.session.bookshelf || {};
    var bookshelf = req.session.bookshelf; // ชั้นวางหนังสือ
    console.log(book_id);
    console.log("------------------------- remove ------------------------");
    console.log(bookshelf);
    // var displayShow = {
    //     items:[],
    //     total:0
    // };
  
    // bookshelf.filter(function(item){
    //     return item.id != req.params.id
    // }) 
    // console.log(bookshelf);
    // for(i in bookshelf){
    //     displayShow.items.push(bookshelf[i]);
    //     total += (bookshelf[i].qty);
    // }
    // displayShow.total = total;
    // res.redirect("/books");
}); 


// ตอนกด แก้ไขหนังสือ 
router.get('/edit/:id',isLoggedIn, function(req, res, next) {
    ModelBooks.getBookId([req.params.id],function(err,item){
        ModelCategory.getAllCategory(function(err,objCategory){
            if(err) throw err
            res.render("books/editForm",{
                data:"แก้ไขหนังสือ",
                CategoryList:objCategory,
                book:item,
                user:req.user,
                bookshelf:req.session.bookshelf
            }) 
        })
    })
}); 


// ตอนกด ค้นหา จะค้นหาจาก 1.รหัสหนังสือ 2.ชื่อหนังสือ 3.ผู้แต่ง  4.หมวดหมู่
router.get('/show/',isLoggedIn, function(req, res, next) {
    var title = req.query.title;
    if(title !== null && title !== '') {

        // หาแบบ where  or และ  {'$regex': title} = like string
        ModelBooks.find({
            "$or": [{
                "code": {'$regex': title}
            },{
                "title": {'$regex': title}
            },{
                "author": {'$regex': title}
            },{
                "category": {'$regex': title}
            }]
        }
            , {}, function(err,item) {
            if(err) throw err
            res.render('books/index', {
                data:"คำค้นหา \""+ title +"\""
                ,BookList:item
                ,user:req.user
                ,bookshelf:req.session.bookshelf
            });
        });
    }else{
        ModelBooks.getAllBooks(function(err,objBooks){
            if(err) throw err
            res.render("books/index",{data:"รายการหนังสือทั้งหมด",BookList:objBooks,user:req.user,bookshelf:req.session.bookshelf});
        });
    }
}); 

// -------------------------------- End get --------------------------------




// -------------------------------- Begin post --------------------------------

// ใช้บันทึกข้อมูลหนังสือ
router.post('/add',isLoggedIn,[
    check('code', 'กรุณากรอกรหัสหนังสือ').not().isEmpty(),
    check('title', 'กรุณากรอกชื่อหนังสือ').not().isEmpty(),
    check('author', 'กรุณากรอกชื่อผู้แต่ง').not().isEmpty(),
    check('all_books','กรุณากรอกจำนวนหนังสือ').not().isEmpty()
], function(req, res, next) {
    // ตรวจข้อมูลที่ บังคับกรอก
    const result = validationResult(req);
    var errors = result.errors;
    for (var key in errors) {
        console.log(errors[key].value);
    }
    if (!result.isEmpty()) {
        // กรณีที่กรอกข้อมูลไม่ครบ
        res.render("books/addForm",{
            data:"เพิ่มหนังสือ",
            errors:errors,
            book:"",
            CategoryList:"",
            user:req.user
        }) 
    }else{
        DetailBook = new ModelBooks({
            code:req.body.code,
            title:req.body.title,
            author:req.body.author,
            category:req.body.category,
            all_books:req.body.all_books
        })
        ModelBooks.createBook(DetailBook,function(err){
            if(err) console.log(err);
            res.redirect("/books") // บันทึกแล้วถ้าไม่ error ให้กลับไปหน้าแรก
        });
    }
}); 



//<--========================= เพิ่ม / แก้ไข หมวดหมู่ ============================================-->
// ใช้บันทึกหมวดหมู่
router.post('/addCategory',isLoggedIn, function(req, res, next) {
   const {code, title} = req.body
   // validation
   if (!code || !title) {
      return true;
   }
    DetailCategory = new ModelCategory({
        code:code,
        title:title
    })
    ModelCategory.createCategory(DetailCategory,function(err){
        if(err) console.log(err);
        res.redirect("/books/addCategory") 
    });
}); 

// ใช้แก้ไขหมวดหมู่
router.post('/editcategory',isLoggedIn, function(req, res, next) {
    DetailCategory = new ModelCategory({
        id:req.body.id,
        code:req.body.code,
        title:req.body.title
    })
    ModelCategory.updateCategory(DetailCategory,function(err){
        if(err) console.log(err);
        res.redirect("/books/addCategory")
    });
}); 

//<--====================================================================================-->


// ใช้แก้ไขหนังสือ
router.post('/update',isLoggedIn,[
    check('title', 'กรุณากรอกชื่อหนังสือ').not().isEmpty(),
    check('author', 'กรุณากรอกชื่อผู้แต่ง').not().isEmpty(),
    check('all_books','กรุณากรอกจำนวนหนังสือ').not().isEmpty()
], function(req, res, next) {
    const result = validationResult(req);
    var errors = result.errors;
    for (var key in errors) {
        console.log(errors[key].value);
    }
    if (!result.isEmpty()) {
        // กรณีที่กรอกข้อมูลไม่ครบ
         res.render("books/addForm",{
             data:"แก้ไขหนังสือ",
             errors:errors,
             book:"",
             CategoryList:"",
             user:req.user
         }) 
    }else{
        DetailBook = new ModelBooks({
            id:req.body.id,
            code:req.body.code,
            title:req.body.title,
            author:req.body.author,
            category:req.body.category,
            all_books:req.body.all_books
        })
        ModelBooks.updateBook(DetailBook,function(err){
            if(err) console.log(err);
            res.redirect("/books") // บันทึกแล้วถ้าไม่ error ให้กลับไปหน้าแรก
        });
    }
}); 




// ใช้กด ยืมหนังสือ ของแต่ละเล่ม
router.post('/borrow/',isLoggedIn,function(req, res, next) {
    var book_id = req.body.book_id;

    req.session.bookshelf = req.session.bookshelf || {};
    var bookshelf = req.session.bookshelf; // ชั้นวางหนังสือ
    ModelBooks.find({
            _id: book_id
        },{},function(err,objBook){
            if (bookshelf[book_id]) { // ยืมมากกว่า 1 เล่มในเรื่องเดิม
                bookshelf[book_id].qty++;
            } else {
                //กดยืมครั้งแรก
                objBook.forEach(function(item) {
                    bookshelf[book_id] = {
                        id: item._id,
                        title: item.title,
                        code: item.code,
                        author: item.author,
                        category: item.category,
                        qty: 1
                    }
                });
            }
        // ต้องส่งรายการหนังสือทั้งหมดออกไปแสดงด้วย objBooks
        ModelBooks.getAllBooks(function(err,objBooks){
            if(err) throw err
            res.render("books/index",{data:"รายการหนังสือทั้งหมด",BookList:objBooks,user:req.user,bookshelf:req.session.bookshelf});
        });
    })
});

// ตอนกดยืนยัน การยืม หนังสือจาก รายการที่เลือกไว้แล้ว
router.post('/cf_borrow',isLoggedIn, function(req, res, next) {
    req.session.bookshelf = req.session.bookshelf || {};
    var bookshelf = req.session.bookshelf;

    DetailBorrow = new ModelBorrow({
        user_id:req.user._id,
        book_id:bookshelf
    })
    ModelBorrow.createBorrow(DetailBorrow,function(err){
        if(err) console.log(err);
         delete req.session.bookshelf;
         res.redirect("/books") 
    });

}); 

// -------------------------------- End post --------------------------------

module.exports = router;
