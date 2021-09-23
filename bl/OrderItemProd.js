
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

const queryItemProdCsv = async (req,res,next)=>{
    let query = req.query;
    try {

        let csvString = "";
        const header = "订单号" + ',' + "商品名称" + ',' + "价格*数量" + ',' +
            "折扣" + ',' + "实际价格" + ',' + "采购单号" + ',' + "供应商"+ ',' + "时间" + ',' + "编号";
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await orderItemProdDAO.queryItemProd(query);

        for (let i = 0; i < rows.length; i++) {
            //订单号
            if (rows[i].order_id == null) {
                parkObj.orderId = '';
            } else {
                parkObj.orderId = rows[i].order_id;
            }

            //商品名称
            if (rows[i].prod_name == null) {
                parkObj.prodName = '';
            } else {
                parkObj.prodName = rows[i].prod_name;
            }

            //价格*数量
            if (rows[i].unit_price == null && rows[i].prod_count == null) {
                parkObj.unitPriceCount = 0;
            } else {
                parkObj.unitPriceCount = rows[i].unit_price + '*' + rows[i].prod_count;
            }

            //折扣
            if (rows[i].discount_prod_price == null) {
                parkObj.discountProdPrice = 0;
            } else {
                parkObj.discountProdPrice = rows[i].discount_prod_price;
            }

            //实际价格
            if (rows[i].actual_prod_price == null) {
                parkObj.actualProdPrice = 0;
            } else {
                parkObj.actualProdPrice = rows[i].actual_prod_price;
            }

            //采购单号
            if (rows[i].purchase_id == null) {
                parkObj.purchaseId = 0;
            } else {
                parkObj.purchaseId = rows[i].purchase_id;
            }

            //供应商
            if (rows[i].supplier_name == null) {
                parkObj.supplierName = '';
            } else {
                parkObj.supplierName = rows[i].supplier_name;
            }

            //时间
            if (rows[i].date_id == null) {
                parkObj.dateId = '';
            } else {
                parkObj.dateId = rows[i].date_id;
            }

            //编码
            if (rows[i].prod_unique_arr == null) {
                parkObj.prodUniqueId = '';
            } else {
                parkObj.prodUniqueId = rows[i].prod_unique_arr.join().replace(/,/g,"|");
            }

            csvString = csvString + parkObj.orderId + "," + parkObj.prodName + "," + parkObj.unitPriceCount + "," +
                parkObj.discountProdPrice + "," + parkObj.actualProdPrice + "," + parkObj.purchaseId + "," +
                parkObj.supplierName +"," + parkObj.dateId + "," + parkObj.prodUniqueId + '\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryItemProdCsv ' + 'success');

    }catch (e) {
        logger.error(" queryItemProdCsv error",e.stack);
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

        //创建 order_item_prod
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

        if(rowsStatus[0].status > 5){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        const rows = await orderItemProdDAO.deleteItemProd(params);
        logger.info(' deleteItemProd ' + 'success');

        if(rows.length <= 0){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

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
    queryItemProdCsv,
    addItemProd,
    updateItemProd,
    updateStatus,
    deleteItemProd
}