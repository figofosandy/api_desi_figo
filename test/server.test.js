const Lab = require('@hapi/lab')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const { expect } = require('@hapi/code')
const { init } = require('../config/server')

describe('GET /', () => {
    let server
    beforeEach(async () => {
        server = await init();
    })
    afterEach(async () => {
        await server.stop();
    })
    it(' test ', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('Hello World');
    })
})