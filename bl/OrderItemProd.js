
const orderDAO = require('../models/OrderDAO');
const orderItemServiceDAO = require('../models/OrderItemServiceDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderItemProd.js');

const queryOrderItemProd = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderItemProdDAO.queryOrderItemProd(query);
        const count = await orderItemProdDAO.queryOrderItemProdCount(query);
        logger.info(' queryPurchase ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryOrderItemProd error",e.stack);
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
    queryOrderItemProd,
    updateStatus
}