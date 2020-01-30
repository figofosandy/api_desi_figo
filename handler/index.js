const Boom = require('@hapi/boom')
const mongoose = require('../config/mongooseConnection')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log('Connected'))

const { userSchema, productSchema, cartSchema } = require('../config/mongooseSchema')
const User = mongoose.model('User', userSchema)
const Product = mongoose.model('Product', productSchema)
const Cart = mongoose.model('Cart', cartSchema)

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

const getNotNullItem = (items) => {
  return (items.find(item => item != null))
}
const loginRequestHandler = (request, h, res) => {
  const data = getNotNullItem([res, request.payload.email, request.payload.username])
  if (!res) {
    request.server.methods.emit('loginFailed', data)
    return Boom.notFound('No User Found')
  }
  request.server.methods.emit('loginSuccess', data)
  return h.response(res).code(202)
}

const registerHandler = (request, h) => {
  const { payload } = request
  return User.create(payload)
    .then(res => {
      request.server.methods.emit('registerSuccess', payload.email)
      return h.response(res).code(201)
    })
    .catch(errorHandler)
}

const loginHandler = (request, h) => {
  const { payload } = request
  return User.findOne(payload).lean()
    .then(res => loginRequestHandler(request, h, res))
    .catch(errorHandler)
}

const getUserHandler = async (request, h) => {
  return User.find({}, { email: 1, username: 1 }).lean()
    .then(res => h.response(res).code(200))
    .catch(errorHandler)
}

const checkConnectedHandler = async (request, h) => {
  return h.response(`${request.params.id} is connected`).code(200)
}

const getProductsHandler = async (request, h) => {
  return Product.find()
    .then(res => h.response(res).code(200))
    .catch(errorHandler)
}

const getCartsHandler = async (request, h) => {
  return Cart.find()
    .then(res => h.response(res).code(200))
    .catch(errorHandler)
}

const addToWishListHandler = async (request, h) => {
  const { payload } = request
  return Cart.create({ ...payload, status: 'wishList', quantity: 1 })
    .then(res => {
      request.server.methods.emit('addToWishListSuccess', payload.owner)
      return h.response(res).code(201)
    })
    .catch(errorHandler)
}

const addToCartGetUpdate = (res, payload) => {
  return !res ? { ...payload, status: 'cart' } : res._doc.status === 'cart' ? { $inc: { quantity: payload.quantity } } : { status: 'cart' }
}

const addToCartRequestHandler = (request, h, res) => {
  const { payload } = request
  const update = addToCartGetUpdate(res, payload)
  return Cart.findOneAndUpdate(
    { owner: payload.owner, name: payload.name },
    update,
    { new: true, upsert: true })
    .lean()
    .then(res => {
      request.server.methods.emit('addToCartSuccess', payload.owner)
      return h.response(res).code(201)
    })
}

const addToCartHandler = async (request, h) => {
  const { payload } = request
  return Cart.findOne({ owner: payload.owner, name: payload.name })
    .then(res => {
      return addToCartRequestHandler(request, h, res)
    })
    .catch(errorHandler)
}

module.exports = { rootHandler, registerHandler, loginHandler, getUserHandler, checkConnectedHandler, getProductsHandler, getCartsHandler, addToCartHandler, addToWishListHandler }
