const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },
  balance: {
    type: Number,
    default: () => Math.floor(Math.random() * 100)
  }
})

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUri: String,
  stock: Number,
  category: String
})

module.exports = { userSchema, productSchema }
