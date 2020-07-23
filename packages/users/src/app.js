const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const Eureka = require('eureka-js-client').Eureka

const PORT = process.env.PORT 

const client = new Eureka({
    // application instance information
    instance: {
        app: 'users',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}`,
        vipAddress: 'users',
        port: {
          $: PORT,
          '@enabled': 'true',
        },
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      registerWithEureka: true,
      fetchRegistry: true,
    },
    eureka: {
      // eureka server host / port
      host: 'localhost',
      port: 9091,
      servicePath: '/eureka/apps/',
    },
  });

const app = express()

app.use(express.json())
app.use(userRouter)


module.exports = {app, client}