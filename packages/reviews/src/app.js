const express = require('express')
require('./db/mongoose')
const reviewRouter = require('./routers/review')

const app = express()

app.use(express.json())
app.use(reviewRouter)

module.exports = app