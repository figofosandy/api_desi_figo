const rootHandler = (request, h) => {
  return h.response('Hello World').code(200)
}

module.exports = { rootHandler }
