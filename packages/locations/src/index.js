const app = require('./app')
const eurekaHelper = require('../../common/src/eureka/eureka-helper')
const port = process.env.PORT 
const eureka = process.env.EUREKA

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', (req, res) => {
    res.json("I am location-service")
   })
  
   console.log(eureka)
  const reg  = eurekaHelper.registerWithEureka('locations', eureka, port);
  console.log(reg)
  