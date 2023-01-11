const {
  TOKEN_ENDPOINT_LIMIT,
  TOKEN_ENDPOINT_LIMIT_WINDOW,
  IP_ENDPOINT_LIMIT,
  IP_ENDPOINT_LIMIT_WINDOW,
} = require('../utility/constant')

const rateLimitRules = {
  '/secure': {
    thresholds: [
      {
        limit: TOKEN_ENDPOINT_LIMIT,
        action: [console.log],
        window: TOKEN_ENDPOINT_LIMIT_WINDOW,
      },
    ],
  },
  '/': {
    thresholds: [
      {
        limit: IP_ENDPOINT_LIMIT,
        action: [console.log],
        window: IP_ENDPOINT_LIMIT_WINDOW,
      },
    ],
  },
}
module.exports = {
  rateLimitRules,
}
