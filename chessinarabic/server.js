const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/config.env' });
const http = require('http');
const app = require('./app');
const setupSocket = require('./socket');

const server = http.createServer(app);

const io = setupSocket(server);

server.listen(process.env.PORT, () => {
  console.log('server listening to port ', process.env.PORT);
});
