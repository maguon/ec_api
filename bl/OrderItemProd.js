
const orderDAO = require('../models/OrderDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderItemProd.js');

const queryItemProd = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderItemProdDAO.queryItemProd(query);
        const count = await orderItemProdDAO.queryItemProdCount(query);
        logger.info(' queryItemProd ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryItemProd error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateItemProd = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderItemProdId ){
        params.orderItemProdId  = path.orderItemProdId ;
    }
    try{
        const rows = await orderItemProdDAO.updateItemProd(params);
        logger.info(' updateItemProd ' + 'success');

        const rowsOrderId = await orderItemProdDAO.queryItemProd(params);
        logger.info(' updateItemProd queryItemProd ' + 'success');

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:rowsOrderId[0].orderId});
        logger.info(' updateItemProd updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateItemProd error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderItemProdId ){
        params.orderItemProdId  = path.orderItemProdId ;
    }
    try{
        const rows = await orderItemProdDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryItemProd,
    updateItemProd,
    updateStatus
}