const app = require('./app')
const eurekaHelper = require('../../common/src/eureka/eureka-helper')
const port = process.env.PORT 

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', (req, res) => {
  res.json("I am user-service")
 })

eurekaHelper.registerWithEureka('users', port);

