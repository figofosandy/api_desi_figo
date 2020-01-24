const { rootHandler, loginHandler, registerHandler, getUserHandler, checkConnectedHandler } = require('../handler')

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

module.exports = [root, login, register, getAllUser, checkConnected]
