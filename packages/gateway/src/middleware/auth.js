const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisasecretformyapp')
        console.log('decoded', decoded)
   
        req.token = token
        req.user = decoded
        console.log('rokwn', req.token)
        console.log('id', req.user._id)
        console.log('role', req.user.role)
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

const access = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
          return next(
            res.status(403).send({ error: `User role "${req.user.role}" is not authorized to access this route` })
          )
        }
        next()
      }
}

module.exports = { auth, access}