require('dotenv').config();

const server = require('./httpServer')({
  port: process.env.PORT,
});
