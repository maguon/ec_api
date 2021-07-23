
const orderDAO = require('../models/OrderDAO');
const orderItemServiceDAO = require('../models/OrderItemServiceDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
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

        //创建成功，创建 order_prod_service
        for(var i=0;i<params.OrderItemProdArray.length;i++){

            params.OrderItemProdArray[i].opUser = path.userId;
            params.OrderItemProdArray[i].clientId = params.clientId;
            params.OrderItemProdArray[i].clientAgentId = params.clientAgentId;
            params.OrderItemProdArray[i].dateId = date;
            params.OrderItemProdArray[i].orderId = rows[0].id;

            //创建 order_prod_service
            const rowsItem = await orderItemProdDAO.addItemProd(params.OrderItemProdArray[i]);
            logger.info(' addOrder addOrderItemService success');

        }

        //创建成功，创建 order_item_service
        for(var i=0;i<params.OrderItemServiceArray.length;i++){

            params.OrderItemServiceArray[i].opUser = path.userId;
            params.OrderItemServiceArray[i].clientId = params.clientId;
            params.OrderItemServiceArray[i].clientAgentId = params.clientAgentId;
            params.OrderItemServiceArray[i].dateId = date;
            params.OrderItemServiceArray[i].orderId = rows[0].id;

            if(params.OrderItemServiceArray[i].saleUserId == undefined){
                params.OrderItemServiceArray[i].sale_user_id = 0;
            }
            if(params.OrderItemServiceArray[i].saleUserName == undefined){
                params.OrderItemServiceArray[i].sale_user_name = '';
            }
            if(params.OrderItemServiceArray[i].deployUserId == undefined){
                params.OrderItemServiceArray[i].deploy_user_id = 0;
            }
            if(params.OrderItemServiceArray[i].deployUserName == undefined){
                params.OrderItemServiceArray[i].deploy_user_name = '';
            }

            //创建 order_item_service
            const rowsItem = await orderItemServiceDAO.addItemService(params.OrderItemServiceArray[i]);
            logger.info(' addOrder addOrderItemService success');

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

const updateOrder = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.orderId){
        params.orderId = path.orderId;
    }
    try{
        const rows = await orderDAO.updateOrder(params);
        logger.info(' updateOrder ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateOrder error ",e.stack);
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
    updateOrder,
    updateStatus
}