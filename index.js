const { init } = require('./config/server')

init()
    .then(server => {
        console.log(`Server running on ${server.info.uri}`)
    })