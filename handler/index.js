const Boom = require('@hapi/boom')
const mongoose = require('../config/mongooseConnection')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log('Connected'))

const { userSchema } = require('../config/mongooseSchema')
const User = mongoose.model('User', userSchema)

const rootHandler = (request, h) => {
  return h.response('Hello World').code(200)
}

const errorHandler = (err) => {
  const errorMessage = err.toString()
  const detail = {
    statusCode: 500,
    message: 'Internal Server Error'
  }
  if (errorMessage.match(/ValidationError|CastError/)) {
    Object.assign(detail, {
      statusCode: 400,
      message: 'Invalid request input'
    })
  } else if (errorMessage.match('E11000')) {
    Object.assign(detail, {
      statusCode: 409,
      message: 'Conflict request input'
    })
  }
  return Boom.boomify(err, detail)
}

const loginRequestHandler = (h, res) => {
  if (!res) {
    return Boom.notFound('No User Found')
  }
  return h.response(res).code(202)
}

const registerHandler = (request, h) => {
  const { payload } = request
  return User.create(payload)
    .then(res => h.response(res).code(201))
    .catch(errorHandler)
}

const loginHandler = (request, h) => {
  const { payload } = request
  return User.findOne(payload)
    .then(res => loginRequestHandler(h, res))
    .catch(errorHandler)
}

module.exports = { rootHandler, registerHandler, loginHandler }
