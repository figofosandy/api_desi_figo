const { rootHandler } = require('../handler')

const root = {
  method: 'GET',
  path: '/',
  handler: rootHandler
}

module.exports = [root]
