const jwt = require('jsonwebtoken')
const { PREDIFINED_TOKEN, SECRET_KEY } = require('../utility/constant')

const authenticate = (req, res, next) => {
  const authCode = req.headers['auth-code']

  if (!authCode) {
    return res
      .status(401)
      .json({ message: 'Auth code is missing from headers.' })
  }

  const token = PREDIFINED_TOKEN.find((tokenItem) => tokenItem === authCode)
  if (!token) {
    return res.status(401).json({ message: 'Invalid auth code.' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token.' })
  }
}

module.exports = authenticate
