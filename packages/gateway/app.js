const express = require('express')
const Eureka = require('eureka-js-client').Eureka

const PORT = process.env.PORT 

const client = new Eureka({
    // application instance information
    instance: {
        app: 'gateway',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}`,
        vipAddress: 'gateway',
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

var userInstance = ''

client.logger.level('debug')
client.start(error => {
    console.log(error || 'NodeJS Eureka Started!')
  
    // App
    app.get('/', (req, res) => {
      res.send('Hello from NodeJS Eureka Client\n')
      res.end()
    })
    
  })


const server = app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})

process.on('SIGINT', function() {
  console.log('Do something useful here.')
  client.stop()
  server.close()
});
