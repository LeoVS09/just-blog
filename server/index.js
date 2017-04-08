const App = require('../libs').App;
const error = require("yeps-error");
const logger = require('yeps-logger');
const router = require('./controllers');


module.exports = new App()
    .all([
        logger(),
        error(),
    ])
    .route(router)
;