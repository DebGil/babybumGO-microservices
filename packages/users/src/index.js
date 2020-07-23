const {app, client} = require('./app')
const port = process.env.PORT 

var nodeInstance = ''

client.logger.level('debug');
client.start(error => {
    console.log(error || 'NodeJS Eureka Started!');
  
    nodeInstance = client.getInstancesByAppId('A-NODE-SERVICE');
    console.log(nodeInstance);
  
    // App
    app.get('/', (req, res) => {
      res.send('Hello from NodeJS Eureka Client\n');
      res.end();
    });
    
    const nodeUrl = `${nodeInstance[0].hostName}:${
      nodeInstance[0].port.$
    }/service-instances/${nodeInstance[0].app}`;
  
    console.log(nodeUrl);
  
    // get node service info endpoint
    app.get(`/serviceInfo/${nodeUrl}`, (req, res) => {
      res.send(JSON.stringify(nodeInstance), null, 2);
      res.end();
    });
  });


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})