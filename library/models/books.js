//const mongoose = require('mongoose');
// //const dbUrl =  "mongodb://localhost:27017/ElibraryDB";
// const dbUrl =  "mongodb+srv://admin:admin@project-x.uxv4g.mongodb.net/ElibraryDB";

// mongoose.connect(dbUrl,{
//     // สั่งให้ connect
//     useNewUrlParser:true,
//     useUnifiedTopology:true,  // ไม่มีจะขึ้น DeprecationWarning
//     useCreateIndex:true     
// });

// const db = mongoose.connection
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const booksSchema = new Schema({
    id:{
        type:Schema.ObjectId // เหมือน PK >> ROW_ID
    },
    code:{
        type:String,
        required : true  // ต้องมีใส่ข้อมูลเข้ามา
    },
    title:{
        type:String,
        required : true  // ต้องมีใส่ข้อมูลเข้ามา
    },
    author:{
        type:String,
        required:true 
    },
    category:{
        type:String,
        required:true
    }
    , all_books:{
        type:Number,
        required:true
    } 
}, { timestamps: { type: Date, default: Date.now} })

const ModelBooks = module.exports = mongoose.model("books",booksSchema)  // ชื่อ collections || table

module.exports.createBook = function(newBooks,callback){ // เหมือน controller
    newBooks.save(callback) // callback คือ ก้อนข้อมูลที่ทำงานใน routes
}

module.exports.updateBook = function(EditBooks,callback){ 
    var query = {
        _id:EditBooks.id
    }
    ModelBooks.findByIdAndUpdate(query,{
        $set : {
            code:EditBooks.code,
            title:EditBooks.title,
            author:EditBooks.author,
            category:EditBooks.category,
            all_books:EditBooks.all_books
        }
    },{new : true},callback)
}


module.exports.getAllBooks = function(data){ // data จะถูกส่งตอนกำหนด routes
    ModelBooks.find(data)
} 

module.exports.deleteBook = function(id,callback){
    ModelBooks.findByIdAndDelete(id,callback)
}

module.exports.getBookId = function(id,callback){
    var query = {
        _id:id
    }
    ModelBooks.findOne(query,callback)
}
