
const orderRefundDAO = require('../models/OrderRefundDAO');
const orderRefundProdDAO = require('../models/OrderRefundProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderRefundProd.js');

const queryRefundProd = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderRefundProdDAO.queryRefundProd(query);
        const count = await orderRefundProdDAO.queryRefundProdCount(query);
        logger.info(' queryRefundProd ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryRefundProd error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryRefundProdStorage = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderRefundProdDAO.queryRefundProdStorage(query);
        const count = await orderRefundProdDAO.queryRefundProdStorageCount(query);
        logger.info(' queryRefundProdStorage ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryRefundProdStorage error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateRefundProd = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderRefundProdId){
        params.orderRefundProdId = path.orderRefundProdId;
    }
    try{
        const rows = await orderRefundProdDAO.updateRefundProd(params);
        logger.info(' updateRefundProd ' + 'success');

        const rowsRefundId = await orderRefundProdDAO.queryRefundProd(params);
        logger.info(' updateRefundProd queryRefundProd ' + 'success');

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:rowsRefundId[0].order_refund_id});
        logger.info(' updateRefundProd updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateRefundProd error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderRefundProdId ){
        params.orderRefundProdId  = path.orderRefundProdId ;
    }
    try{
        const rows = await orderRefundProdDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryRefundProd,
    queryRefundProdStorage,
    updateRefundProd,
    updateStatus
}