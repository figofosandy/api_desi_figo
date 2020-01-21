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

  server.route(routes)

  await server.start()

  process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
  })

  process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
  })

  return server
}

module.exports = { init }
