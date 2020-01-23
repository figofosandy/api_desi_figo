const Lab = require('@hapi/lab')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const { expect } = require('@hapi/code')
const { init } = require('../config/server')

const callingApi = (server, detail) => {
  return server.inject(detail)
}

const registerNewUser = (server, payload) => {
  const detail = {
    method: 'POST',
    url: '/v1/register',
    payload
  }
  return callingApi(server, detail)
}

const loginUser = (server, payload) => {
  const detail = {
    method: 'POST',
    url: '/v1/login',
    payload
  }
  return callingApi(server, detail)
}

describe('Test Api Services', () => {
  let server

  beforeEach(async () => {
    server = await init()
  })

  afterEach(async () => {
    await server.stop()
  })

  it('root route response success', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result).to.equal('Hello World')
  })

  it('responds "/register" with valid email and username', async () => {
    const username = `sample${Date.now()}`
    const email = `${username}@mail.com`
    const password = 'password'
    const payload = {
      username,
      email,
      password
    }
    const res = await registerNewUser(server, payload)
    expect(res.statusCode).to.equal(201)
    expect(res.result.email).to.equal(email)
    expect(res.result.username).to.equal(username)
    expect(res.result.password).to.equal(password)
  })

  it('responds "/register" with not available email or username', async () => {
    const username = `sample${Date.now()}`
    const email = `${username}@mail.com`
    const password = 'password'
    const payload = {
      username,
      email,
      password
    }
    await registerNewUser(server, payload)
    const res = await registerNewUser(server, payload)
    expect(res.statusCode).to.equal(409)
  })

  it('responds "/login" with registered email succesfully', async () => {
    const username = `sample${Date.now()}`
    const email = `${username}@mail.com`
    const password = 'password'
    const payload = {
      username,
      email,
      password
    }
    await registerNewUser(server, payload)
    const loginUsingUsername = await loginUser(server, {
      username,
      password
    })
    const loginUsingEmail = await loginUser(server, {
      email,
      password
    })
    expect(loginUsingUsername.statusCode).to.equal(202)
    expect(loginUsingEmail.statusCode).to.equal(202)
  })

  it('responds "/login" with registered email and wrong password failed', async () => {
    const username = `sample${Date.now()}`
    const email = `${username}@mail.com`
    const password = 'password'
    const wrongPassword = 'wrongpassword'
    const payload = {
      username,
      email,
      password
    }
    await registerNewUser(server, payload)
    const loginUsingUsername = await loginUser(server, {
      username,
      password: wrongPassword
    })
    const loginUsingEmail = await loginUser(server, {
      email,
      password: wrongPassword
    })
    expect(loginUsingUsername.statusCode).to.equal(404)
    expect(loginUsingEmail.statusCode).to.equal(404)
  })
})
