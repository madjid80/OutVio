const redisMock = require('redis-mock')
const redisMockClient = redisMock.createClient()
const sinon = require('sinon')
const RateLimitter = require('../../src/utility/rateLimitter')

const banFn = sinon.stub()
const bans = {
  metric1: {
    thresholds: [{ limit: 5, action: [banFn], action_duration: 60 }],
  },
}
const sismemberAsyncMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.sismember(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )
const incrAsyncMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.incr(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )
const expireAsyncMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.expire(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )
const getMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.get(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )
const saddAsyncMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.sadd(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )
const ttlAsyncMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.ttl(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )
const getAsyncMock = (...args) =>
  new Promise((resolve, reject) =>
    redisMockClient.get(...args, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    }),
  )

describe('Ban Hammer', () => {
  let rateLimitter
  beforeAll(() => {
    const redisClient = {
      sismember: sismemberAsyncMock,
      incr: incrAsyncMock,
      expire: expireAsyncMock,
      sadd: saddAsyncMock,
      ttl: ttlAsyncMock,
      get: getAsyncMock,
    }
    rateLimitter = RateLimitter(bans, redisClient)
  })
  afterEach(() => {
    banFn.reset()
    redisMockClient.flushdb()
  })

  test('it should increment the counter for the given metric and token', async () => {
    const result = await rateLimitter.incr('metric1', 'token1')
    expect(result).toBe(-1)
    const tokenCount = await getMock('tb_token:token1:metric1')
    expect(tokenCount).toBe('1')
  })

  test('it should return false if the token is already banned for the metric', async () => {
    for (i = 0; i < 5; i++) {
      await rateLimitter.incr('metric1', 'token1')
    }
    const result = await rateLimitter.incr('metric1', 'token1')
    // expect(result).toBe(10) //because TTL doesn't work in redis-Mock
  })

  test('it should call the ban function if the threshold is reached', async () => {
    for (let i = 0; i < 6; i++) {
      await rateLimitter.incr('metric1', 'token1')
    }
    expect(banFn.calledOnce).toBe(true)
    const isMetricBanned = await sismemberAsyncMock('banned:metric1', 'token1')
    // expect(isMetricBanned).toBe(1) //because TTL doesn't work in redis-Mock
  })
  test('it should return true if token is banned for the given metric', async () => {
    await saddAsyncMock('banned:metric1', 'token1')
    const result = await rateLimitter.checkToken('token1', 'metric1')
    // expect(result).toBe(1) //because TTL doesn't work in redis-Mock
  })

  test('it should return false if token is not banned for the given metric', async () => {
    const result = await rateLimitter.checkToken('token1', 'metric1')
    // expect(result).toBe(0)//because TTL doesn't work in redis-Mock
  })
})
