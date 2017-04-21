#!/usr/bin/env node

const config = require('../config.json');
const app = require('../server');


app.listen(config.port);

console.log("Server start at the port: " + config.port);