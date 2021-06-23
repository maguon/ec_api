const path = require('path');
const restify = require('restify');
const Errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');

const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');

const app = require('./bl/App');
const user = require('./bl/User');
const userTypeMenu = require('./bl/UserTypeMenu');
// const supplier = require('./bl/Supplier');


const createServer=()=>{



    const server = restify.createServer({

        name: 'EC-API',
        version: '0.0.1'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());

    const corsAllowHeadersArray =[];
    corsAllowHeadersArray.push('auth-token');
    corsAllowHeadersArray.push('user-name');
    corsAllowHeadersArray.push('user-type');
    corsAllowHeadersArray.push('user-id');
    corsAllowHeadersArray.push("Access-Control-Allow-Origin");
    corsAllowHeadersArray.push("Access-Control-Allow-Credentials");
    corsAllowHeadersArray.push("GET","POST","PUT","DELETE");
    corsAllowHeadersArray.push("Access-Control-Allow-Headers","accept","api-version", "content-length", "content-md5","x-requested-with","content-type", "date", "request-id", "response-time");
    const cors = corsMiddleware({

        allowHeaders:corsAllowHeadersArray
    })
    server.pre(cors.preflight);
    server.use(cors.actual);

    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());

    server.get('/docs/*', // don't forget the `/*`
        restify.plugins.serveStaticFiles('./public/docs')
    );


    /**
     * User Module
     */
    server.post({path:'/api/userLogin',contentType: 'application/json'}, user.userLogin);
    server.get('/api/user', user.queryUser);
    server.post({path:'/api/user',contentType: 'application/json'}, user.addUser);
    server.put({path:'/api/user/:userId',contentType: 'application/json'} ,user.updateUser);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.updatePassword);
    server.put({path:'/api/user/:userId/type',contentType: 'application/json'} ,user.updateType);
    server.put({path:'/api/user/:userId/status',contentType: 'application/json'} ,user.updateStatus);
    server.del({path:'/api/user/:userId',contentType: 'application/json'},user.deleteUser);

    /**
     * UserTypeMenu Module
     */
    server.get('/api/user/:userId/typeMenu', userTypeMenu.queryUserTypeMenu);
    server.post({path:'/api/user/:userId/typeMenu',contentType: 'application/json'}, userTypeMenu.addUserTypeMenu);
    server.put({path:'/api/user/:userId/typeId/:typeId/status',contentType: 'application/json'} ,userTypeMenu.updateStatus);

    /**
     * Supplier Module
     */
    // server.get('/api/user/:userId/Supplier', supplier.querySupplier);
    // server.post({path:'/api/user/:userId/Supplier',contentType: 'application/json'}, supplier.addSupplier);
    // server.put({path:'/api/user/:userId/supplierId/:supplierId/status',contentType: 'application/json'} ,supplier.updateStatus);

    /**
     * App Module
     */
    server.get('/api/user/:userId/app', app.queryApp);
    server.post({path:'/api/user/:userId/app',contentType: 'application/json'}, app.addApp);
    server.put({path:'/api/user/:userId/app/:appId',contentType: 'application/json'} ,app.updateApp);
    server.put({path:'/api/user/:userId/app/:appId/status',contentType: 'application/json'} ,app.updateStatus);
    server.del({path:'/api/user/:userId/app/:appId/del',contentType: 'application/json'},app.deleteApp);


    server.on('NotFound', function (req, res ,err,next) {
        logger.warn(req.url + " not found");

        const error = new Errors.NotFoundError();
        res.send(error);
        return next();
    });
    return (server);

}

module.exports = {
    createServer
}