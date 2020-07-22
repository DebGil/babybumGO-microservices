const express = require('express')
require('./db/mongoose')
const proposalRouter = require('./routers/proposal')

const app = express()

app.use(express.json())
app.use(proposalRouter)

module.exports = app