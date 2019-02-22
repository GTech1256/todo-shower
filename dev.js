const app = require('./app');
require('./server');

process.env.NODE_ENV = 'development'; // set NODE_ENV without dependences

app();
