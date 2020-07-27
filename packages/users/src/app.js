const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const Eureka = require('eureka-js-client').Eureka

const PORT = process.env.PORT 

const app = express()

app.use(express.json())
app.use(userRouter)

module.exports = app