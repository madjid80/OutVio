const RateLimitter = (bans, redisClient) => {
  const incr = async (metric, token) => {
    try {
      const key = `tb_token:${token}:${metric}`
      const value = await redisClient.incr(key)
      for (const threshold of bans[metric]['thresholds']) {
        if (value > threshold['limit']) {
          const remainTime = await redisClient.ttl(key)
          await takeAction(token, metric, threshold['action'], remainTime)
          return remainTime
        } else if (value === 1) {
          await redisClient.expire(key, threshold['window'])
        }
      }
      return -1
    } catch (err) {
      throw new Error(err)
    }
  }

  const checkToken = async (token, metric) => {
    try {
      const key = `tb_token:${token}:${metric}`
      const result = await redisClient.get(key)
      if (result == undefined) {
        return -1
      }
      for (const threshold of bans[metric]['thresholds']) {
        if (value > threshold['limit']) {
          const remainTime = await redisClient.ttl(key)
          return remainTime
        }
      }
      return -1
    } catch (err) {
      throw new Error(err)
    }
  }

  const takeAction = async (token, metric, actions, duration) => {
    for (let action of actions) {
      if (typeof action === 'function') {
        await action(token, duration, metric)
      }
    }
  }

  return {
    incr,
    checkToken,
  }
}

module.exports = RateLimitter
