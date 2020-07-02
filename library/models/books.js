const mongoose = require('mongoose');
const mongo = require('mongodb');
const dbUrl =  "mongodb+srv://admin:admin@project-x.uxv4g.mongodb.net/ElibraryDB";

mongoose.connect(dbUrl,{
    // สั่งให้ connect
    useNewUrlParser:true,
    useUnifiedTopology:true  // ไม่มีจะขึ้น DeprecationWarning
});

const db = mongoose.connection
const Schema = mongoose.Schema

// new Schema ได้มาจาก mongoose.Schema
const booksSchema = new Schema({
    id:{
        type:Schema.ObjectId // เหมือน PK >> ROW_ID
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
})

const ModelBooks = module.exports = mongoose.model("Books",booksSchema)  // ชื่อ collections || table

module.exports.createBook = function(newBooks,callback){ // เหมือน controller
    newBooks.save(callback) // callback คือ ก้อนข้อมูลที่ทำงานใน routes
}


module.exports.getAllBooks = function(data){ // data จะถูกส่งตอนกำหนด routes
    ModelBooks.find(data)
} 