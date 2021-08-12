
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

const addRefundService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    if(path.orderRefundId){
        params.orderRefundId = path.orderRefundId;
    }
    if(path.itemServiceId){
        params.itemServiceId = path.itemServiceId;
    }
    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {

        //创建 order_refund_Service
        const rowsItem = await orderRefundServiceDAO.addRefundService(params);
        logger.info(' addRefundService addRefundService success');

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:path.orderRefundId});
        logger.info(' addRefundService updatePrice success');

        logger.info(' addRefundService ' + 'success');
        resUtil.resetCreateRes(res,rowsItem);
        return next();

    }catch (e) {
        logger.error(" addRefundService error ",e.stack);
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

const deleteRefundService = async (req,res,next)=>{
    let params = req.query
    let path = req.params;
    if(path.userId){
        params.userId = path.userId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    if(path.orderRefundId){
        params.orderRefundId = path.orderRefundId;
    }
    if(path.itemServiceId){
        params.itemServiceId = path.itemServiceId;
    }
    if(path.orderRefundServiceId){
        params.orderRefundServiceId = path.orderRefundServiceId;
    }
    try{
        //判断订单状态是否在处理以上
        const rowsStatus = await orderRefundDAO.queryOrderRefund(params);
        logger.info(' deleteRefundService queryOrderRefund ' + 'success');

        if(rowsStatus[0].status > 5){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        const rows = await orderRefundServiceDAO.deleteRefundService(params);
        logger.info(' deleteRefundService ' + 'success');

        if(rows.length <= 0){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:params.orderRefundId});
        logger.info(' deleteRefundService updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteRefundService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryRefundService,
    addRefundService,
    updateRefundService,
    updateStatus,
    deleteRefundService
}