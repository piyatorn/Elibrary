//const ModelBooks = require('/books')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  fullname: String,
  username: {
    type: String,
    unique: true
  },
  password: String,
  gender:String,
  tel:String,
  is_admin:Boolean,
  is_active:Boolean 
}, { timestamps: { type: Date, default: Date.now} })

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel