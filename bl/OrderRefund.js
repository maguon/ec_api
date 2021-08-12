
const orderRefundDAO = require('../models/OrderRefundDAO');
const orderRefundServiceDAO = require('../models/OrderRefundServiceDAO');
const orderRefundProdDAO = require('../models/OrderRefundProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const systemConst = require('../util/SystemConst.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('OrderRefund.js');

const queryOrderRefund = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderRefundDAO.queryOrderRefund(query);
        const count = await orderRefundDAO.queryOrderRefundCount(query);
        logger.info(' queryOrderRefund ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryOrderRefund error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addOrderRefund = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderId){
        params.orderId = path.orderId ;
    }

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        //创建 order_refund
        const rows = await orderRefundDAO.addOrderRefund(params);

        if(rows.length < 1){
            logger.info(' addOrderRefund ' + ' failed! ');
            resUtil.resetFailedRes(res,{message:'创建订单退款失败！'});
            return next();
        }

        //创建成功，创建 order_refund_prod
        for(var i=0;i<params.OrderRefundProdArray.length;i++){
            params.OrderRefundProdArray[i].opUser = path.userId;
            params.OrderRefundProdArray[i].orderRefundId = rows[0].id;
            params.OrderRefundProdArray[i].orderId = params.orderId;
            params.OrderRefundProdArray[i].dateId = date;
            const rowsItem = await orderRefundProdDAO.addRefundProd(params.OrderRefundProdArray[i]);
            logger.info(' addOrderRefund addOrderRefundService success');

        }

        //创建成功，创建 order_refund_service
        for(var i=0;i<params.OrderRefundServiceArray.length;i++){
            params.OrderRefundServiceArray[i].opUser = path.userId;
            params.OrderRefundServiceArray[i].orderRefundId = rows[0].id;
            params.OrderRefundServiceArray[i].orderId = params.orderId;
            params.OrderRefundServiceArray[i].dateId = date;
            const rowsItem = await orderRefundServiceDAO.addRefundService(params.OrderRefundServiceArray[i]);
            logger.info(' addOrderRefund addOrderRefundService success');

        }

        //更新 order_refund
        const updateRows = await orderRefundDAO.updatePrice({orderRefundId:rows[0].id});
        logger.info(' addOrderRefund updatePrice success');

        logger.info(' addOrderRefund ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addOrderRefund error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateOrderRefund = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderRefundId ){
        params.orderRefundId  = path.orderRefundId ;
    }
    try{
        const rows = await orderRefundDAO.updateOrderRefund(params);
        logger.info(' updateOrderRefund ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateOrderRefund error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderRefundId){
        params.orderRefundId = path.orderRefundId;
    }

    try{
        const rows = await orderRefundDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryStat = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderRefundDAO.queryStat(query);
        logger.info(' queryStat ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryStat error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryOrderRefund,
    addOrderRefund,
    updateOrderRefund,
    updateStatus,
    queryStat
}