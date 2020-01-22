const { rootHandler, loginHandler, registerHandler } = require('../handler')

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

module.exports = [root, login, register]
