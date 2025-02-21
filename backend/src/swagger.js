require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'Backend APIs',
      description: 'Description'
    },
    host: `localhost:${process.env.PORT}`,
};
  
const outputFile = './swagger-output.json';

const routes = ['./routes.js'];

swaggerAutogen(outputFile, routes, doc);
