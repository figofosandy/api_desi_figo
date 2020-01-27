'use strict'

const Hapi = require('@hapi/hapi')

require('dotenv').config()

const config = require('./config.json')[process.env.NODE_ENV]

const routes = require('../route')

const init = async () => {
  const server = Hapi.server({
    port: config.port || process.env.PORT,
    host: '0.0.0.0'
  })

  await server.register(require('@hapi/inert'))

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
