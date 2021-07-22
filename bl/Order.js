
const orderDAO = require('../models/OrderDAO');
const orderItemServiceDAO = require('../models/OrderItemServiceDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Order.js');

const queryOrder = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await orderDAO.queryOrder(query);
        const count = await orderDAO.queryOrderCount(query);
        logger.info(' queryOrder ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryOrder error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addOrder = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        //创建 order_info
        const rows = await orderDAO.addOrder(params);

        //创建成功，创建 order_item_service / order_prod_service
        for(var i=0;i<params.orderServiceList.length;i++){

            params.orderServiceList[i].opUser = path.userId;
            params.orderServiceList[i].clientId = params.clientId;
            params.orderServiceList[i].clientAgentId = params.clientAgentId;
            params.orderServiceList[i].dateId = date;
            params.orderServiceList[i].orderId = rows[0].id;

            if(params.orderServiceList[i].saleServiceId != undefined){
                //创建 order_item_service
                const rowsItem = await orderItemServiceDAO.addOrderItemService(params.orderServiceList[i]);
                logger.info(' addOrder addOrderItemService success');

            }else if(params.orderServiceList[i].prodId != undefined){
                //创建 order_prod_service
                const rowsItem = await orderItemProdDAO.addOrderItemProd(params.orderServiceList[i]);
                logger.info(' addOrder addOrderItemService success');

            }
        }

        //更新 order_info : service_price , prod_price , discount_price , actual_price
        const updateRows = await orderDAO.updatePrice({orderId:rows[0].id});
        logger.info(' addOrder updatePrice success');

        logger.info(' addOrder ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addOrder error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    try{
        const rows = await orderDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryOrder,
    addOrder,
    updateStatus
}