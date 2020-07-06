const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    id:{
        type:Schema.ObjectId
    },
    code:{
        type:String,
        required : true,  // ต้องมีใส่ข้อมูลเข้ามา
        unique: true
    },
    title:{
        type:String,
        required : true  // ต้องมีใส่ข้อมูลเข้ามา
    }
}, { timestamps: { type: Date, default: Date.now} })

const ModelCategory = module.exports = mongoose.model("category",CategorySchema)  // ชื่อ collections || table


module.exports.createCategory = function(newCategory,callback){ 
    newCategory.save(callback) 
}

module.exports.getAllCategory = function(data){ // data จะถูกส่งตอนกำหนด routes
    ModelCategory.find(data)
} 

module.exports.deleteCategory = function(id,callback){
    ModelCategory.findByIdAndDelete(id,callback)
}

module.exports.getCategoryId = function(id,callback){
    var query = {
        _id:id
    }
    ModelCategory.findOne(query,callback)
}

module.exports.updateCategory = function(EditCategory,callback){ 
    var query = {
        _id:EditCategory.id
    }
    ModelCategory.findByIdAndUpdate(query,{
        $set : {
            code:EditCategory.code,
            title:EditCategory.title
        }
    },{new : true},callback)
}
