const path = require('path');
const restify = require('restify');
const Errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');

const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');

const app = require('./bl/App');
const user = require('./bl/User');
const userTypeMenu = require('./bl/UserTypeMenu');
const brand = require('./bl/Brand');
const brandModel = require('./bl/BrandModel');
const category = require('./bl/Category');
const categorySub = require('./bl/CategorySub');
const storage = require('./bl/Storage');
const storageArea = require('./bl/StorageArea');
const supplier = require('./bl/Supplier');
const product = require('./bl/Product');


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
    server.get('/api/user/:userId/user', user.queryUser);
    server.get('/api/user/:userId', user.queryUserSysInfo);
    server.post({path:'/api/user/:userId/user',contentType: 'application/json'}, user.addUser);
    server.put({path:'/api/user/:userId',contentType: 'application/json'} ,user.updateUser);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.updatePassword);
    server.put({path:'/api/user/:userId/type',contentType: 'application/json'} ,user.updateType);
    server.put({path:'/api/user/:userId/status',contentType: 'application/json'} ,user.updateStatus);

    /**
     * UserTypeMenu Module
     */
    server.get('/api/user/:userId/typeMenu', userTypeMenu.queryUserTypeMenu);
    server.post({path:'/api/user/:userId/typeMenu',contentType: 'application/json'}, userTypeMenu.addUserTypeMenu);
    server.put({path:'/api/user/:userId/typeId/:typeId/status',contentType: 'application/json'} ,userTypeMenu.updateStatus);

    /**
     * Brand Module
     */
    server.get('/api/user/:userId/brand', brand.queryBrand);
    server.post({path:'/api/user/:userId/brand',contentType: 'application/json'}, brand.addBrand);
    server.put({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'} ,brand.updateBrand);
    server.put({path:'/api/user/:userId/brand/:brandId/status',contentType: 'application/json'} ,brand.updateStatus);
    server.del({path:'/api/user/:userId/brand/:brandId/del',contentType: 'application/json'},brand.deleteBrand);

    /**
     * BrandModel Module
     */
    server.get('/api/user/:userId/brandModel', brandModel.queryBrandModel);
    server.post({path:'/api/user/:userId/brandModel',contentType: 'application/json'}, brandModel.addBrandModel);
    server.put({path:'/api/user/:userId/brandModel/:brandModelId',contentType: 'application/json'} ,brandModel.updateBrandModel);
    server.put({path:'/api/user/:userId/brandModel/:brandModelId/status',contentType: 'application/json'} ,brandModel.updateStatus);
    server.del({path:'/api/user/:userId/brandModel/:brandModelId/del',contentType: 'application/json'},brandModel.deleteBrandModel);

    /**
     * Category Module
     */
    server.get('/api/user/:userId/category', category.queryCategory);
    server.post({path:'/api/user/:userId/category',contentType: 'application/json'}, category.addCategory);
    server.put({path:'/api/user/:userId/category/:categoryId',contentType: 'application/json'} ,category.updateCategory);
    server.put({path:'/api/user/:userId/category/:categoryId/status',contentType: 'application/json'} ,category.updateStatus);
    server.del({path:'/api/user/:userId/category/:categoryId/del',contentType: 'application/json'},category.deleteCategory);

    /**
     * CategorySub Module
     */
    server.get('/api/user/:userId/categorySub', categorySub.queryCategorySub);
    server.post({path:'/api/user/:userId/categorySub',contentType: 'application/json'}, categorySub.addCategorySub);
    server.put({path:'/api/user/:userId/categorySub/:categorySubId',contentType: 'application/json'} ,categorySub.updateCategorySub);
    server.put({path:'/api/user/:userId/categorySub/:categorySubId/status',contentType: 'application/json'} ,categorySub.updateStatus);
    server.del({path:'/api/user/:userId/categorySub/:categorySubId/del',contentType: 'application/json'},categorySub.deleteCategorySub);

    /**
     * Storage Module
     */
    server.get('/api/user/:userId/storage', storage.queryStorage);
    server.post({path:'/api/user/:userId/storage',contentType: 'application/json'}, storage.addStorage);
    server.put({path:'/api/user/:userId/storage/:storageId',contentType: 'application/json'} ,storage.updateStorage);
    server.put({path:'/api/user/:userId/storage/:storageId/status',contentType: 'application/json'} ,storage.updateStatus);
    server.del({path:'/api/user/:userId/storage/:storageId/del',contentType: 'application/json'},storage.deleteStorage);

    /**
     * StorageArea Module
     */
    server.get('/api/user/:userId/storageArea', storageArea.queryStorageArea);
    server.post({path:'/api/user/:userId/storageArea',contentType: 'application/json'}, storageArea.addStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:storageAreaId',contentType: 'application/json'} ,storageArea.updateStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:storageAreaId/status',contentType: 'application/json'} ,storageArea.updateStatus);
    server.del({path:'/api/user/:userId/storageArea/:storageAreaId/del',contentType: 'application/json'},storageArea.deleteStorageArea);

    /**
     * Supplier Module
     */
    server.get('/api/user/:userId/supplier', supplier.querySupplier);
    server.post({path:'/api/user/:userId/supplier',contentType: 'application/json'}, supplier.addSupplier);
    server.put({path:'/api/user/:userId/supplier/:supplierId',contentType: 'application/json'} ,supplier.updateSupplier);
    server.put({path:'/api/user/:userId/supplier/:supplierId/status',contentType: 'application/json'} ,supplier.updateStatus);
    server.del({path:'/api/user/:userId/supplier/:supplierId/del',contentType: 'application/json'},supplier.deleteSupplier);

    /**
     * Product Module
     */
    server.get('/api/user/:userId/product', product.queryProduct);
    server.post({path:'/api/user/:userId/product',contentType: 'application/json'}, product.addProduct);
    server.put({path:'/api/user/:userId/product/:productId',contentType: 'application/json'} ,product.updateProduct);
    server.put({path:'/api/user/:userId/product/:productId/status',contentType: 'application/json'} ,product.updateStatus);
    server.del({path:'/api/user/:userId/product/:productId/del',contentType: 'application/json'},product.deleteProduct);


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