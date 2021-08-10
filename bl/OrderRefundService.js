
const orderRefundDAO = require('../models/OrderRefundDAO');
const orderRefundServiceDAO = require('../models/OrderRefundServiceDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderRefundService.js');

const queryRefundService = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderRefundServiceDAO.queryRefundService(query);
        const count = await orderRefundServiceDAO.queryRefundServiceCount(query);
        logger.info(' queryRefundService ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryRefundService error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateRefundService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderRefundServiceId){
        params.orderRefundServiceId = path.orderRefundServiceId;
    }
    try{
        const rows = await orderRefundServiceDAO.updateRefundService(params);
        logger.info(' updateRefundService ' + 'success');

        const rowsRefundId = await orderRefundServiceDAO.queryRefundService(params);
        logger.info(' updateRefundService queryRefundService ' + 'success');

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:rowsRefundId[0].order_refund_id});
        logger.info(' updateRefundService updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateItemService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderRefundServiceId){
        params.orderRefundServiceId = path.orderRefundServiceId;
    }
    try{
        const rows = await orderRefundServiceDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryRefundService,
    updateRefundService,
    updateStatus
}