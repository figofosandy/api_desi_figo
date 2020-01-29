'use strict'
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('../package.json')

require('dotenv').config()

const config = require('./config.json')[process.env.NODE_ENV]

const routes = require('../route')

const init = async () => {
  const server = Hapi.server({
    port: config.port || process.env.PORT,
    host: '0.0.0.0'
  })

  const swaggerOptions = {
    info: {
      title: 'Test API Documentation',
      version: Pack.version
    }
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  server.route(routes)

  const io = require('socket.io')(server.listener)

  server.method('emit', (event, data) => {
    io.emit(event, data)
  }, {})

  await server.start()

  process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
  })

  return server
}

module.exports = { init }
