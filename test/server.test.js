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

  it('GetAllUser responds success', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/getAllUser'
    })
    expect(res.statusCode).to.equal(200)
  })

  it('Check connected', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/checkConnected/I'
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result).to.equal('I is connected')
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

  it('Get product image', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/products/mie_goreng.jpg'
    })
    expect(res.statusCode).to.equal(200)
  })

  it('Get All Products responds success', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/getAllProduct'
    })
    expect(res.statusCode).to.equal(200)
  })

  it('Get All Carts responds success', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/getAllCart/sample'
    })
    expect(res.statusCode).to.equal(200)
  })

  it('Add to Cart success', async () => {
    const username = `sample${Date.now()}`
    const email = `${username}@mail.com`
    const password = 'password'
    const payload = {
      email,
      username,
      password
    }
    const detail = {
      method: 'POST',
      url: '/v1/addToCart',
      payload: {
        name: 'Flanel',
        price: 13,
        imageUri: 'baju_flanel.jpg',
        quantity: 1,
        category: 'clothes',
        owner: username
      }
    }
    await registerNewUser(server, payload)
    const addToCart = await callingApi(server, detail)
    expect(addToCart.statusCode).to.equal(201)
    expect(addToCart.result.owner).to.equal(username)
  })

  it('Add to Wishlist success', async () => {
    const timeStamp = Date.now()
    const username = `sample${timeStamp}`
    const email = `${username}@mail.com`
    const password = 'password'
    const payload = {
      email,
      username,
      password
    }
    const detail = {
      method: 'POST',
      url: '/v1/addToWishList',
      payload: {
        name: `sample product ${timeStamp}`,
        price: 7,
        imageUri: `${timeStamp}.jpg`,
        category: 'food_and_drink',
        owner: username
      }
    }
    await registerNewUser(server, payload)
    const addToWishlist = await callingApi(server, detail)
    expect(addToWishlist.statusCode).to.equal(201)
    expect(addToWishlist.result.owner).to.equal(username)
    expect(addToWishlist.result.status).to.equal('wishList')
  })
})
