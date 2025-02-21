const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const routes = require('./routes');

app = express()

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());
app.use('/',routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app