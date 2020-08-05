const express = require('express')
// const path = require('path');
//const gateway = require('express-gateway');
const eurekaHelper = require('../common/src/eureka/eureka-helper')
const port = process.env.PORT 

const locations = require('./src/api/locations')
const users = require('./src/api/users')
const reviews = require('./src/api/reviews')
const proposals = require('./src/api/proposals')

const app = express()

app.use(users)
app.use(locations)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', (req, res) => {
  res.json("I am gateway-service")
 })

eurekaHelper.registerWithEureka('gateway', port);

// gateway()
//   .load(path.join(__dirname, 'config'))
//   .run();




