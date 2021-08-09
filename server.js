const path = require('path');
const restify = require('restify');
const Errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');

const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');

const app = require('./bl/App');
const sms = require('./bl/Sms');
const user = require('./bl/User');
const userTypeMenu = require('./bl/UserTypeMenu');
const brand = require('./bl/Brand');
const brandModel = require('./bl/BrandModel');
const category = require('./bl/Category');
const categorySub = require('./bl/CategorySub');
const storage = require('./bl/Storage');
const storageArea = require('./bl/StorageArea');
const storageProductRel = require('./bl/StorageProductRel');
const storageProductRelDetail = require('./bl/StorageProductRelDetail');
const storageCheck = require('./bl/StorageCheck');
const storageCheckRel = require('./bl/StorageCheckRel');
const supplier = require('./bl/Supplier');
const product = require('./bl/Product');
const purchase = require('./bl/Purchase');
const purchaseItem = require('./bl/PurchaseItem');
const purchaseRefund = require('./bl/PurchaseRefund');
const client = require('./bl/Client');
const clientAgent = require('./bl/ClientAgent');
const clientAgentInvoice = require('./bl/ClientAgentInvoice');
const saleService = require('./bl/SaleService');
const saleServiceProdRel = require('./bl/SaleServiceProdRel');
const order = require('./bl/Order');
const orderItemProd = require('./bl/OrderItemProd');
const orderItemService = require('./bl/OrderItemService');
const payment = require('./bl/Payment');
const orderPaymentRel = require('./bl/PaymentOrderRel');
const statistics = require('./bl/Statistics');


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
    server.put({path:'/api/phone/:phone/password',contentType: 'application/json'},user.updatePasswordByPhone);
    server.put({path:'/api/phone/:phone/changePhone',contentType: 'application/json'},user.updatePhone);
    server.put({path:'/api/user/:userId/type',contentType: 'application/json'} ,user.updateType);
    server.put({path:'/api/user/:userId/status',contentType: 'application/json'} ,user.updateStatus);

    /**
     * SMS Module
     */
    server.post({path:'/api/phone/:phone/passwordSms',contentType: 'application/json'},sms.passwordSms);
    server.post({path:'/api/phone/:phone/changePhoneSms',contentType: 'application/json'},sms.changePhoneSms);

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
    server.post({path:'/api/user/:userId/brandFile',contentType: 'application/json'}, brand.uploadBrandFile);
    server.put({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'} ,brand.updateBrand);
    server.put({path:'/api/user/:userId/brand/:brandId/status',contentType: 'application/json'} ,brand.updateStatus);
    server.del({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'},brand.deleteBrand);

    server.get('/api/user/:userId/brandModel', brandModel.queryBrandModel);
    server.post({path:'/api/user/:userId/brandModel',contentType: 'application/json'}, brandModel.addBrandModel);
    server.put({path:'/api/user/:userId/brandModel/:brandModelId',contentType: 'application/json'} ,brandModel.updateBrandModel);
    server.put({path:'/api/user/:userId/brandModel/:brandModelId/status',contentType: 'application/json'} ,brandModel.updateStatus);
    server.del({path:'/api/user/:userId/brandModel/:brandModelId',contentType: 'application/json'},brandModel.deleteBrandModel);

    /**
     * Category Module
     */
    server.get('/api/user/:userId/category', category.queryCategory);
    server.post({path:'/api/user/:userId/category',contentType: 'application/json'}, category.addCategory);
    server.post({path:'/api/user/:userId/categoryFile',contentType: 'application/json'}, category.uploadCategoryFile);
    server.put({path:'/api/user/:userId/category/:categoryId',contentType: 'application/json'} ,category.updateCategory);
    server.put({path:'/api/user/:userId/category/:categoryId/status',contentType: 'application/json'} ,category.updateStatus);
    server.del({path:'/api/user/:userId/category/:categoryId',contentType: 'application/json'},category.deleteCategory);

    server.get('/api/user/:userId/categorySub', categorySub.queryCategorySub);
    server.post({path:'/api/user/:userId/categorySub',contentType: 'application/json'}, categorySub.addCategorySub);
    server.put({path:'/api/user/:userId/categorySub/:categorySubId',contentType: 'application/json'} ,categorySub.updateCategorySub);
    server.put({path:'/api/user/:userId/categorySub/:categorySubId/status',contentType: 'application/json'} ,categorySub.updateStatus);
    server.del({path:'/api/user/:userId/categorySub/:categorySubId',contentType: 'application/json'},categorySub.deleteCategorySub);

    /**
     * Storage Module
     */
    server.get('/api/user/:userId/storage', storage.queryStorage);
    server.post({path:'/api/user/:userId/storage',contentType: 'application/json'}, storage.addStorage);
    server.put({path:'/api/user/:userId/storage/:storageId',contentType: 'application/json'} ,storage.updateStorage);
    server.put({path:'/api/user/:userId/storage/:storageId/status',contentType: 'application/json'} ,storage.updateStatus);
    server.del({path:'/api/user/:userId/storage/:storageId',contentType: 'application/json'},storage.deleteStorage);

    server.get('/api/user/:userId/storageArea', storageArea.queryStorageArea);
    server.post({path:'/api/user/:userId/storageArea',contentType: 'application/json'}, storageArea.addStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:storageAreaId',contentType: 'application/json'} ,storageArea.updateStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:storageAreaId/status',contentType: 'application/json'} ,storageArea.updateStatus);
    server.del({path:'/api/user/:userId/storageArea/:storageAreaId',contentType: 'application/json'},storageArea.deleteStorageArea);

    server.get('/api/user/:userId/storageProductRel', storageProductRel.queryStorageProductRel);
    server.get('/api/user/:userId/storageProductRel.csv', storageProductRel.queryStorageProductRelCsv);
    server.post({path:'/api/user/:userId/storage/:storageId/product/:productId/storageProductRel',contentType: 'application/json'}, storageProductRel.addStorageProductRel);
    server.put({path:'/api/user/:userId/storageProductRel/:storageProductRelId',contentType: 'application/json'} ,storageProductRel.updateStorageProductRel);
    server.put({path:'/api/user/:userId/storageProductRel/:storageProductRelId/storageMove',contentType: 'application/json'} ,storageProductRel.updateStorageMove);

    server.get('/api/user/:userId/storageProductRelDetail', storageProductRelDetail.queryStorageProductRelDetail);
    server.get('/api/user/:userId/storageProductRelDetail.csv', storageProductRelDetail.queryStorageProductRelDetailCsv);
    server.post({path:'/api/user/:userId/storageProductRel/:storageProductRelId/storProdRelDetailImport',contentType: 'application/json'}, storageProductRelDetail.addRelDetailImport);
    server.post({path:'/api/user/:userId/storageProductRel/:storageProductRelId/storProdRelDetailExport',contentType: 'application/json'}, storageProductRelDetail.addRelDetailExport);

    server.get('/api/user/:userId/storageCheck', storageCheck.queryStorageCheck);
    server.post({path:'/api/user/:userId/storageCheck',contentType: 'application/json'}, storageCheck.addStorageCheck);
    server.put({path:'/api/user/:userId/storageCheck/:storageCheckId',contentType: 'application/json'} ,storageCheck.updateStorageCheck);
    server.put({path:'/api/user/:userId/storageCheck/:storageCheckId/status',contentType: 'application/json'} ,storageCheck.updateStatus);

    server.post({path:'/api/user/:userId/storageCheckRel',contentType: 'application/json'}, storageCheckRel.addStorageCheckRel);
    server.get('/api/user/:userId/storageCheckRel', storageCheckRel.queryStorageCheckRel);
    server.get('/api/user/:userId/storageCheck/:storageCheckId/storageCheckRel.csv', storageCheckRel.queryStorageCheckRelCsv);
    server.put({path:'/api/user/:userId/storageCheckRel/:storageCheckRelId',contentType: 'application/json'} ,storageCheckRel.updateStorageCheckRel);

    server.get('/api/user/:userId/storageProductRelStat' ,storageProductRel.queryStat);
    server.get('/api/user/:userId/storageCheckStat' ,storageCheck.queryStat);

    /**
     * Supplier Module
     */
    server.get('/api/user/:userId/supplier', supplier.querySupplier);
    server.post({path:'/api/user/:userId/supplier',contentType: 'application/json'}, supplier.addSupplier);
    server.put({path:'/api/user/:userId/supplier/:supplierId',contentType: 'application/json'} ,supplier.updateSupplier);
    server.put({path:'/api/user/:userId/supplier/:supplierId/status',contentType: 'application/json'} ,supplier.updateStatus);
    server.del({path:'/api/user/:userId/supplier/:supplierId',contentType: 'application/json'},supplier.deleteSupplier);

    /**
     * Product Module
     */
    server.get('/api/user/:userId/product', product.queryProduct);
    server.post({path:'/api/user/:userId/product',contentType: 'application/json'}, product.addProduct);
    server.put({path:'/api/user/:userId/product/:productId',contentType: 'application/json'} ,product.updateProduct);
    server.put({path:'/api/user/:userId/product/:productId/status',contentType: 'application/json'} ,product.updateStatus);
    server.del({path:'/api/user/:userId/product/:productId',contentType: 'application/json'},product.deleteProduct);

    /**
     * Purchase Module
     */
    server.get('/api/user/:userId/purchase', purchase.queryPurchase);
    server.post({path:'/api/user/:userId/purchase',contentType: 'application/json'}, purchase.addPurchase);
    server.put({path:'/api/user/:userId/purchase/:purchaseId',contentType: 'application/json'} ,purchase.updatePurchase);
    server.put({path:'/api/user/:userId/purchase/:purchaseId/storageStatus',contentType: 'application/json'} ,purchase.updateStorageStatus);
    server.put({path:'/api/user/:userId/purchase/:purchaseId/paymentStatus',contentType: 'application/json'} ,purchase.updatePaymentStatus);
    server.put({path:'/api/user/:userId/purchase/:purchaseId/status',contentType: 'application/json'} ,purchase.updateStatus);
    server.get('/api/user/:userId/purchaseAndItem', purchase.queryPurchaseAndItem);

    server.get('/api/user/:userId/purchaseItem', purchaseItem.queryPurchaseItem);
    server.get('/api/user/:userId/purchaseItemStorage', purchaseItem.queryPurchaseItemStorage);
    server.put({path:'/api/user/:userId/purchaseItem/:purchaseItemId',contentType: 'application/json'} ,purchaseItem.updatePurchaseItem);
    server.put({path:'/api/user/:userId/purchase/:purchaseId/purchaseItem/:purchaseItemId/storageStatus',contentType: 'application/json'} ,purchaseItem.updateStorageStatus);

    server.get('/api/user/:userId/purchaseRefund', purchaseRefund.queryPurchaseRefund);
    server.post({path:'/api/user/:userId/purchase/:purchaseId/purchaseItem/:purchaseItemId/purchaseRefund',contentType: 'application/json'}, purchaseRefund.addPurchaseRefund);
    server.put({path:'/api/user/:userId/purchaseItem/:purchaseItemId/purchaseRefund/:purchaseRefundId',contentType: 'application/json'} ,purchaseRefund.updatePurchaseRefund);
    server.put({path:'/api/user/:userId/purchaseRefund/:purchaseRefundId/paymentStatus',contentType: 'application/json'} ,purchaseRefund.updatePaymentStatus);
    server.put({path:'/api/user/:userId/purchaseRefund/:purchaseRefundId/status',contentType: 'application/json'} ,purchaseRefund.updateStatus);
    server.put({path:'/api/user/:userId/purchaseRefund/:purchaseRefundId/storageProductRel/:storageProductRelId/refundStorage',contentType: 'application/json'} ,purchaseRefund.updateRefundStorage);

    server.get('/api/user/:userId/purchaseStat' ,purchase.queryStat);
    server.get('/api/user/:userId/purchaseItemStat' ,purchaseItem.queryStat);
    server.get('/api/user/:userId/purchaseRefundStat' ,purchaseRefund.queryStat);

    /**
     * Client Module
     */
    server.get('/api/user/:userId/client', client.queryClient);
    server.post({path:'/api/user/:userId/client',contentType: 'application/json'}, client.addClient);
    server.put({path:'/api/user/:userId/client/:clientId',contentType: 'application/json'} ,client.updateClient);
    server.put({path:'/api/user/:userId/client/:clientId/status',contentType: 'application/json'} ,client.updateStatus);

    server.get('/api/user/:userId/clientAgent', clientAgent.queryClientAgent);
    server.post({path:'/api/user/:userId/clientAgent',contentType: 'application/json'}, clientAgent.addClientAgent);
    server.put({path:'/api/user/:userId/clientAgent/:clientAgentId',contentType: 'application/json'} ,clientAgent.updateClientAgent);
    server.put({path:'/api/user/:userId/clientAgent/:clientAgentId/status',contentType: 'application/json'} ,clientAgent.updateStatus);

    server.get('/api/user/:userId/clientAgentInvoice', clientAgentInvoice.queryClientAgentInvoice);
    server.post({path:'/api/user/:userId/clientAgent/:clientAgentId/clientAgentInvoice',contentType: 'application/json'}, clientAgentInvoice.addClientAgentInvoice);
    server.put({path:'/api/user/:userId/clientAgentInvoice/:clientAgentInvoiceId',contentType: 'application/json'} ,clientAgentInvoice.updateClientAgentInvoice);

    /**
     * Service Module
     */
    server.get('/api/user/:userId/saleService', saleService.querySaleService);
    server.post({path:'/api/user/:userId/saleService',contentType: 'application/json'}, saleService.addSaleService);
    server.put({path:'/api/user/:userId/saleService/:saleServiceId',contentType: 'application/json'} ,saleService.updateSaleService);
    server.put({path:'/api/user/:userId/saleService/:saleServiceId/status',contentType: 'application/json'} ,saleService.updateStatus);

    server.get('/api/user/:userId/saleServiceProdRel', saleServiceProdRel.querySaleServiceProdRel);
    server.post({path:'/api/user/:userId/saleService/:saleServiceId/product/:productId',contentType: 'application/json'}, saleServiceProdRel.addSaleServiceProdRel);
    server.del({path:'/api/user/:userId/saleService/:saleServiceId/product/:productId',contentType: 'application/json'}, saleServiceProdRel.deleteServiceProdRel);

    /**
     * Order Module
     */
    server.get('/api/user/:userId/order', order.queryOrder);
    server.get('/api/user/:userId/order.csv', order.queryOrderCsv);
    server.post({path:'/api/user/:userId/order',contentType: 'application/json'}, order.addOrder);
    server.put({path:'/api/user/:userId/order/:orderId',contentType: 'application/json'} ,order.updateOrder);
    server.put({path:'/api/user/:userId/order/:orderId/status',contentType: 'application/json'} ,order.updateStatus);

    server.get('/api/user/:userId/orderItemProd', orderItemProd.queryItemProd);
    server.get('/api/user/:userId/orderItemProdStorage', orderItemProd.queryItemProdStorage);
    server.post({path:'/api/user/:userId/order/:orderId/orderItemProd',contentType: 'application/json'}, orderItemProd.addItemProd);
    server.put({path:'/api/user/:userId/orderItemProd/:orderItemProdId',contentType: 'application/json'} ,orderItemProd.updateItemProd);
    server.put({path:'/api/user/:userId/orderItemProd/:orderItemProdId/status',contentType: 'application/json'} ,orderItemProd.updateStatus);
    server.del({path:'/api/user/:userId/order/:orderId/orderItemProd/:orderItemProdId',contentType: 'application/json'}, orderItemProd.deleteItemProd);

    server.get('/api/user/:userId/orderItemService', orderItemService.queryItemService);
    server.post({path:'/api/user/:userId/order/:orderId/orderItemService',contentType: 'application/json'}, orderItemService.addItemService);
    server.put({path:'/api/user/:userId/orderItemService/:orderItemServiceId',contentType: 'application/json'} ,orderItemService.updateItemService);
    server.put({path:'/api/user/:userId/orderItemService/:orderItemServiceId/deploy',contentType: 'application/json'} ,orderItemService.updateDeploy);
    server.put({path:'/api/user/:userId/orderItemService/:orderItemServiceId/check',contentType: 'application/json'} ,orderItemService.updateCheck);
    server.put({path:'/api/user/:userId/orderItemService/:orderItemServiceId/status',contentType: 'application/json'} ,orderItemService.updateStatus);
    server.del({path:'/api/user/:userId/order/:orderId/orderItemService/:orderItemServiceId',contentType: 'application/json'}, orderItemService.deleteItemService);

    /**
     * Payment Module
     */
    server.get('/api/user/:userId/payment', payment.queryPayment);
    server.post({path:'/api/user/:userId/payment',contentType: 'application/json'}, payment.addPayment);
    server.put({path:'/api/user/:userId/payment/:paymentId/status',contentType: 'application/json'} ,payment.updateStatus);
    server.put({path:'/api/user/:userId/payment/:paymentId',contentType: 'application/json'} ,payment.updatePayment);
    server.del({path:'/api/user/:userId/payment/:paymentId',contentType: 'application/json'}, payment.deletePayment);

    /**
     * OrderPaymentRel Module
     */
    server.get('/api/user/:userId/paymentOrderRel', orderPaymentRel.queryPaymentOrderRel);
    server.put({path:'/api/user/:userId/paymentOrderRel/:paymentOrderRelId',contentType: 'application/json'} ,orderPaymentRel.updatePaymentOrderRel);


    /**
     * App Module
     */
    server.get('/api/user/:userId/app', app.queryApp);
    server.post({path:'/api/user/:userId/app',contentType: 'application/json'}, app.addApp);
    server.put({path:'/api/user/:userId/app/:appId',contentType: 'application/json'} ,app.updateApp);
    server.put({path:'/api/user/:userId/app/:appId/status',contentType: 'application/json'} ,app.updateStatus);
    server.del({path:'/api/user/:userId/app/:appId',contentType: 'application/json'},app.deleteApp);

    /**
     * Statistics Module
     */
    server.get('/api/user/:userId/statPurchaseByMonth', statistics.queryPurchaseStatByMonth);
    server.get('/api/user/:userId/statPurchaseByDay', statistics.queryPurchaseStatByDay);

    server.get('/api/user/:userId/statClientByMonth', statistics.queryClientStatByMonth);
    server.get('/api/user/:userId/statClientByDay', statistics.queryClientStatByDay);

    server.get('/api/user/:userId/statOrderByMonth', statistics.queryOrderStatByMonth);
    server.get('/api/user/:userId/statOrderByDay', statistics.queryOrderStatByDay);



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