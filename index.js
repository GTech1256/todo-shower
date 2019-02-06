const app = require('./app');

process.env.NODE_ENV = 'production'; // set NODE_ENV without dependences

app(); // start app
