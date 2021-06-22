'use strict'
const myServer = require('./server');
const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('main');

(() =>{

    const server = myServer.createServer();
    server.listen(9911, () => {

        logger.info('EC-API server has been  started ,listening at %s', server.url);
    });
})();
