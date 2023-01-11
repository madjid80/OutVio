const RateLimitter = require('../utility/rateLimitter')
const { rateLimitRules } = require('../utility/config')
const asyncRedis = require('async-redis')
//TODO read redis config from constant and env
const client = asyncRedis.createClient({
  url: 'redis://127.0.0.1:6379',
})

const rateLimitterMiddleware = async (req, res, next) => {
  let token
  const metric = req.route.path
  if (req.user) {
    token = req.user.userId
  } else {
    token = req.ip
  }
  const ttl = await RateLimitter(rateLimitRules, client).incr(metric, token)

  if (ttl !== -1) {
    res.status(429).json({
      message: `Too many requests, please try again after ${ttl}`,
    })
  } else {
    next()
  }
}

module.exports = rateLimitterMiddleware
