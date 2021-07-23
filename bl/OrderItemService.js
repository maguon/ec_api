
const orderDAO = require('../models/OrderDAO');
const orderItemServiceDAO = require('../models/OrderItemServiceDAO');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderItemService.js');

const queryItemService = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderItemServiceDAO.queryItemService(query);
        const count = await orderItemServiceDAO.queryItemServiceCount(query);
        logger.info(' queryItemService ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryItemService error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateItemService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderItemServiceId){
        params.orderItemServiceId = path.orderItemServiceId;
    }
    try{
        const rows = await orderItemServiceDAO.updateItemService(params);
        logger.info(' updateItemService ' + 'success');

        const rowsOrderId = await orderItemServiceDAO.queryItemService(params);
        logger.info(' updateItemService queryItemService ' + 'success');

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:rowsOrderId[0].orderId});
        logger.info(' updateItemService updatePrice success');


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
    if(path.orderItemServiceId){
        params.orderItemServiceId = path.orderItemServiceId;
    }
    try{
        const rows = await orderItemServiceDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryItemService,
    updateItemService,
    updateStatus
}