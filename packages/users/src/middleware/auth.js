const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

const access = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
          return next(
            res.status(403).send({ error: `User role ${req.user.role} is not authorized to access this route` })
          )
        }
        next()
      }
}

module.exports = { auth, access}