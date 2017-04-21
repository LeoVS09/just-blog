const { App, static } = require('../libs');
const error = require("yeps-error");
const logger = require('yeps-logger');
const router = require('./controllers');






module.exports = new App()
    .all([
        logger(),
        error(),
        static()
    ])
    .route(router)
;


