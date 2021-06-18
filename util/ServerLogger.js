const config = require('../config/');


const createLogger = (name) => {
    const log4js = require('log4js');
    log4js.configure(config.loggerConfig);
    return log4js.getLogger(name);
}

module.exports = {createLogger }