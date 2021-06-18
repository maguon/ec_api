const serverLogger = require('../../util/ServerLogger.js');
const logger = serverLogger.createLogger('PgConnections.js');
const config = require('../../config');
let initOptions  = {};
if(config.pgConfig.initOptions.native){
    initOptions = {query(e) {
        logger.debug(e.query);
    }}
}
const pgp = require('pg-promise')(initOptions);

const cn = config.pgConfig.connectOptions;

const pgDb = pgp(cn);

module.exports = pgDb;