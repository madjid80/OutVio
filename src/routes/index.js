var express = require('express')
const authenticate = require('../middlewares/authenticate')
const rateLimitterMiddleware = require('../middlewares/rateLimitterMiddleware')
var router = express.Router()

router.get('/', rateLimitterMiddleware, function (req, res, next) {
  res.json({ message: 'Welcome to public API' })
})
router.post('/secure', authenticate, rateLimitterMiddleware, (req, res) => {
  res.json({ message: 'Welcome ' + req.user.username + ' to private API' })
})
module.exports = router
