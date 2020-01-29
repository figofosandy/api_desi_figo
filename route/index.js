const { rootHandler, loginHandler, registerHandler, getUserHandler, checkConnectedHandler, getProductsHandler } = require('../handler')
const Joi = require('@hapi/joi')

const userDetailSchema = Joi.object({
  _id: Joi.any(),
  email: Joi.string(),
  password: Joi.string(),
  username: Joi.string(),
  balance: Joi.number(),
  __v: Joi.number()
}).label('User Detail')

const errorSchema = Joi.object({
  error: Joi.string(),
  statusCode: Joi.number(),
  message: Joi.string()
}).label('Error Response')

const root = {
  method: 'GET',
  path: '/',
  options: {
    handler: rootHandler,
    description: 'Get Root',
    notes: 'Display Hello World',
    tags: ['api']
  }
}

const login = {
  method: 'POST',
  path: '/v1/login',
  options: {
    handler: loginHandler,
    description: 'Login',
    notes: 'Login using email or username',
    tags: ['api'],
    validate: {
      payload: Joi.object({
        email: Joi.string()
          .email()
          .description('the email for login'),
        password: Joi.string()
          .required()
          .description('the password for login'),
        username: Joi.string()
          .alphanum()
          .description('the username for login and must be alphanum')
      }).label('Login Payload')
    },
    response: {
      status: {
        202: userDetailSchema,
        400: errorSchema,
        404: errorSchema,
        409: errorSchema
      }
    }
  }
}

const register = {
  method: 'POST',
  path: '/v1/register',
  options: {
    handler: registerHandler,
    description: 'Register',
    notes: 'Register for new user',
    tags: ['api'],
    validate: {
      payload: Joi.object({
        email: Joi.string()
          .email()
          .required()
          .description('the email for the new user detail and must be email'),
        password: Joi.string()
          .min(8)
          .required()
          .description('the password for the new user detail and must be minimal 8 characters'),
        username: Joi.string()
          .alphanum()
          .required()
          .description('the username for the new user detail and must be alphanum')
      }).label('Register Payload')
    },
    response: {
      status: {
        201: Joi.any(),
        400: errorSchema,
        404: errorSchema,
        409: errorSchema
      }
    }
  }
}

const getAllUser = {
  method: 'GET',
  path: '/v1/getAllUser',
  options: {
    handler: getUserHandler,
    description: 'Get All User',
    notes: 'Get all user list',
    tags: ['api']
  }
}

const checkConnected = {
  method: 'GET',
  path: '/v1/checkConnected/{id}',
  options: {
    handler: checkConnectedHandler,
    description: 'Check Connected ',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api'],
    validate: {
      params: Joi.object({
        id: Joi.string()
          .required()
          .description('For check connected')
      })
    }
  }
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
  options: {
    handler: getProductsHandler,
    description: 'Get All Product',
    notes: 'Get all product list',
    tags: ['api']
  }
}

module.exports = [root, login, register, getAllUser, checkConnected, serveImageFiles, getAllProduct]
