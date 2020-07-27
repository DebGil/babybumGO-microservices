const app = require('./app')
const eurekaHelper = require('../../common/src/eureka/eureka-helper');
const port = process.env.PORT 

var nodeInstance = ''

// client.start(error => {
//     console.log(error || 'NodeJS Eureka Started!');
  
//     nodeInstance = client.getInstancesByAppId('USERS');
//     console.log(nodeInstance);
  
//     // App
//     app.get('/', (req, res) => {
//       res.send('Hello from NodeJS Eureka Client\n');
//       res.end();
//     });
    
//     const nodeUrl = `${nodeInstance[0].hostName}:${
//       nodeInstance[0].port.$
//     }/service-instances/${nodeInstance[0].app}`;
  
//     console.log('nodeURL', nodeUrl);
  
//     // get node service info endpoint
//     app.get(`/serviceInfo/${nodeUrl}`, (req, res) => {
//       res.send(JSON.stringify(nodeInstance), null, 2);
//       res.end();
//     });
//   });


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', (req, res) => {
  res.json("I am user-service")
 })

eurekaHelper.registerWithEureka('users', port);


// process.on('SIGINT', function() {
//   client.stop()
//   server.close()
// });