
const orderDAO = require('../models/OrderDAO');
const orderItemServiceDAO = require('../models/OrderItemServiceDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const serverLogger = require('../util/ServerLogger.js');
const systemConst = require('../util/SystemConst.js');
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

const queryOrderCsv = async (req,res,next)=>{
    let query = req.query;
    try{

        let csvString = "";
        const header = "订单号" + ',' + "接单人" + ',' + "客户集群" + ',' +
            "客户姓名" + ',' + "客户电话" + ',' + "车牌" + ',' + "服务费" + ',' +
            "商品金额" + ',' + "折扣" + ',' + "实际金额" + ',' + "订单类型" + ',' +
            "订单状态" + ',' + "创建日期" + ',' + "完成日期" ;
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await orderDAO.queryOrder(query);

        for (let i = 0; i < rows.length; i++) {
            //订单号
            if (rows[i].id == null) {
                parkObj.orderId = '';
            } else {
                parkObj.orderId = rows[i].id;
            }

            //接单人
            if (rows[i].re_user_name == null) {
                parkObj.reUserName = '';
            } else {
                parkObj.reUserName = rows[i].re_user_name;
            }

            //客户集群
            if (rows[i].client_agent_name == null) {
                parkObj.clientAgentName = '';
            } else {
                parkObj.clientAgentName = rows[i].client_agent_name;
            }

            //客户姓名
            if (rows[i].client_name == null) {
                parkObj.clientName = '';
            } else {
                parkObj.clientName = rows[i].client_name;
            }

            //客户电话
            if (rows[i].client_tel == null) {
                parkObj.clientTel = '';
            } else {
                parkObj.clientTel = rows[i].client_tel;
            }

            //车牌
            if (rows[i].client_serial == null) {
                parkObj.clientSerial = '';
            } else {
                parkObj.clientSerial = rows[i].client_serial;
            }

            //服务费
            if (rows[i].service_price == null) {
                parkObj.servicePrice = '';
            } else {
                parkObj.servicePrice = rows[i].service_price;
            }

            //商品金额
            if (rows[i].prod_price == null) {
                parkObj.prodPrice = '';
            } else {
                parkObj.prodPrice = rows[i].prod_price;
            }

            //折扣
            if (rows[i].total_discount_price == null) {
                parkObj.totalDiscountPrice = '';
            } else {
                parkObj.totalDiscountPrice = rows[i].total_discount_price;
            }

            //实际金额
            if (rows[i].total_actual_price == null) {
                parkObj.totalActualPrice = '';
            } else {
                parkObj.totalActualPrice = rows[i].total_actual_price;
            }

            //订单类型
            if (rows[i].order_type == null) {
                parkObj.orderType = '';
            } else {
                if(rows[i].order_type == systemConst.orderType.interior){
                    parkObj.orderType = '内部';
                }else if(rows[i].order_type == systemConst.orderType.without){
                    parkObj.orderType = '外部';
                }else{
                    parkObj.orderType = '';
                }
            }

            //订单状态
            if (rows[i].status == null) {
                parkObj.status = '';
            } else {
                if(rows[i].status == systemConst.orderStatus.normal){
                    parkObj.status = '未处理';
                }else if(rows[i].status == systemConst.orderStatus.processing){
                    parkObj.status = '处理中';
                }else if(rows[i].status == systemConst.orderStatus.checking){
                    parkObj.status = '未结算';
                }else if(rows[i].status == systemConst.orderStatus.complete){
                    parkObj.status = '处理完成';
                }else {
                    parkObj.status = '';
                }
            }

            //创建日期
            if (rows[i].date_id == null) {
                parkObj.dateId = '';
            } else {
                parkObj.dateId = rows[i].date_id ;
            }

            //完成日期
            if (rows[i].fin_date_id == null) {
                parkObj.finDateId = '';
            } else {
                parkObj.finDateId = rows[i].fin_date_id;
            }

            csvString = csvString + parkObj.orderId + "," + parkObj.reUserName + "," + parkObj.clientAgentName + "," +
                parkObj.clientName + "," + parkObj.clientTel + "," + parkObj.clientSerial + "," + parkObj.servicePrice + "," +
                parkObj.prodPrice + "," + parkObj.totalDiscountPrice + "," + parkObj.totalActualPrice + "," + parkObj.orderType + "," +
                parkObj.status + "," + parkObj.dateId + "," + parkObj.finDateId + '\r\n';
        }

        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryOrderCsv ' + 'success');

    }catch (e) {
        logger.error(" queryOrderCsv error",e.stack);
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
    if(params.status == systemConst.orderStatus.complete){
        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.finDateId = date;
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
    queryOrderCsv,
    addOrder,
    updateOrder,
    updateStatus
}