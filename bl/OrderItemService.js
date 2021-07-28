
const orderDAO = require('../models/OrderDAO');
const orderItemServiceDAO = require('../models/OrderItemServiceDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
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

const addItemService = async (req,res,next)=>{
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

        //创建 order_item_service
        const rowsItem = await orderItemServiceDAO.addItemService(params);
        logger.info(' addItemService addItemService success');

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:path.orderId});
        logger.info(' addItemService updatePrice success');

        logger.info(' addItemService ' + 'success');
        resUtil.resetCreateRes(res,rowsItem);
        return next();

    }catch (e) {
        logger.error(" addItemService error ",e.stack);
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
        const updateRows = await orderDAO.updatePrice({orderId:rowsOrderId[0].order_id});
        logger.info(' updateItemService updatePrice success');


        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateItemService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateDeploy = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderItemServiceId){
        params.orderItemServiceId = path.orderItemServiceId;
    }
    try{
        const rows = await orderItemServiceDAO.updateDeploy(params);
        logger.info(' updateDeploy ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateDeploy error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateCheck = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderItemServiceId){
        params.orderItemServiceId = path.orderItemServiceId;
    }
    try{
        const rows = await orderItemServiceDAO.updateCheck(params);
        logger.info(' updateCheck ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateCheck error ",e.stack);
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

const deleteItemService = async (req,res,next)=>{
    let params = req.query
    let path = req.params;
    if(path.userId){
        params.userId = path.userId;
    }
    if(path.orderItemServiceId){
        params.orderItemServiceId = path.orderItemServiceId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    try{
        //判断订单状态是否在处理以上
        const rowsStatus = await orderDAO.queryOrder(params);
        logger.info(' deleteItemService queryOrder ' + 'success');

        if(rowsStatus > 5){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        const rows = await orderItemServiceDAO.deleteItemService(params);
        logger.info(' deleteItemService ' + 'success');

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:params.orderId});
        logger.info(' deleteItemService updatePrice success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteItemService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryItemService,
    addItemService,
    updateItemService,
    updateDeploy,
    updateCheck,
    updateStatus,
    deleteItemService
}