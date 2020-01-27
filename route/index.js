const { rootHandler, loginHandler, registerHandler, getUserHandler, checkConnectedHandler, getProductsHandler } = require('../handler')

const root = {
  method: 'GET',
  path: '/',
  handler: rootHandler
}

const login = {
  method: 'POST',
  path: '/v1/login',
  handler: loginHandler
}

const register = {
  method: 'POST',
  path: '/v1/register',
  handler: registerHandler
}

const getAllUser = {
  method: 'GET',
  path: '/v1/getAllUser',
  handler: getUserHandler
}

const checkConnected = {
  method: 'GET',
  path: '/v1/checkConnected/{id}',
  handler: checkConnectedHandler
}

const serveImageFiles = {
  method: 'GET',
  path: '/v1/products/{image*}',
  handler: {
    directory: {
      path: 'public/image',
      listing: true
    }
  }
}

const getAllProduct = {
  method: 'GET',
  path: '/v1/getAllProduct',
  handler: getProductsHandler
}

module.exports = [root, login, register, getAllUser, checkConnected, serveImageFiles, getAllProduct]
