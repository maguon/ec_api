
const orderDAO = require('../models/OrderDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
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

const queryItemProdStorage = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderItemProdDAO.queryItemProdStorage(query);
        const count = await orderItemProdDAO.queryItemProdStorageCount(query);
        logger.info(' queryItemProdStorage ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryItemProdStorage error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addItemProd = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {

        //创建 order_prod_service
        const rowsItem = await orderItemProdDAO.addItemProd(params);
        logger.info(' addOrder addItemProd success');

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:path.orderId});
        logger.info(' addOrder updatePrice success');

        logger.info(' addOrder ' + 'success');
        resUtil.resetCreateRes(res,rowsItem);
        return next();

    }catch (e) {
        logger.error(" addOrder error ",e.stack);
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
        const updateRows = await orderDAO.updatePrice({orderId:rowsOrderId[0].order_id});
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

const deleteItemProd = async (req,res,next)=>{
    let params = req.query
    let path = req.params;
    if(path.userId){
        params.userId = path.userId;
    }
    if(path.orderItemProdId){
        params.orderItemProdId = path.orderItemProdId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    try{
        //判断订单状态是否在处理以上
        const rowsStatus = await orderDAO.queryOrder(params);
        logger.info(' deleteItemProd queryOrder ' + 'success');

        if(rowsStatus > 5){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        const rows = await orderItemProdDAO.deleteItemProd(params);
        logger.info(' deleteItemProd ' + 'success');

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:params.orderId});
        logger.info(' deleteItemProd updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteItemProd error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryItemProd,
    queryItemProdStorage,
    addItemProd,
    updateItemProd,
    updateStatus,
    deleteItemProd
}