const express = require('express')
require('./db/mongoose')
const locationRouter = require('./routers/location')

const app = express()

app.use(express.json())
app.use(locationRouter)

module.exports = app