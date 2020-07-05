const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowSchema = new Schema({
    id:{
        type:Schema.ObjectId
    },
    user_id:{
        type:String,
        required : true 
    },
    book_id:{
        type:Object,
        required : true 
    }
}, { timestamps: { type: Date, default: Date.now} })

const ModelBorrow = module.exports = mongoose.model("borrow",borrowSchema)

module.exports.createBorrow = function(newTran,callback){
    newTran.save(callback) 
}

module.exports.getAllBorrow = function(data){ 
    ModelBorrow.find(data)
} 
