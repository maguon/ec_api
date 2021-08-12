
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

const addRefundProd = async (req,res,next)=>{
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
    if(path.itemProdId){
        params.itemProdId = path.itemProdId;
    }
    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {

        //创建 order_refund_prod
        const rowsItem = await orderRefundProdDAO.addRefundProd(params);
        logger.info(' addRefundProd addRefundProd success');

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:path.orderRefundId});
        logger.info(' addRefundProd updatePrice success');

        logger.info(' addRefundProd ' + 'success');
        resUtil.resetCreateRes(res,rowsItem);
        return next();

    }catch (e) {
        logger.error(" addOrder error ",e.stack);
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
    if(path.orderId){
        params.orderId = path.orderId;
    }
    if(path.orderRefundId){
        params.orderRefundId = path.orderRefundId;
    }
    if(path.itemProdId){
        params.itemProdId = path.itemProdId;
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

const deleteRefundProd = async (req,res,next)=>{
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
    if(path.itemProdId){
        params.itemProdId = path.itemProdId;
    }
    if(path.orderRefundProdId){
        params.orderRefundProdId = path.orderRefundProdId;
    }
    try{
        //判断订单状态是否在处理以上
        const rowsStatus = await orderRefundDAO.queryOrderRefund(params);
        logger.info(' deleteRefundProd queryOrderRefund ' + 'success');

        if(rowsStatus[0].status > 5){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        const rows = await orderRefundProdDAO.deleteRefundProd(params);
        logger.info(' deleteRefundProd ' + 'success');

        if(rows.length <= 0){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:params.orderRefundId});
        logger.info(' deleteRefundProd updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteRefundProd error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryRefundProd,
    addRefundProd,
    updateRefundProd,
    updateStatus,
    deleteRefundProd
}