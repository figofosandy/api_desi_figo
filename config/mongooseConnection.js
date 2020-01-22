require('dotenv').config()

const mongoose = require('mongoose')

const config = require('./config.json')[process.env.NODE_ENV]

mongoose.connect(config.mongoServer, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true)
}

module.exports = mongoose
