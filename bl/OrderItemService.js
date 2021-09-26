
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

const queryItemServiceCsv = async (req,res,next)=>{
    let query = req.query;
    try {

        let csvString = "";
        const header = "订单号" + ',' + "服务名称" + ',' + "售价" + ',' +
            "折扣" + ',' + "实际价格" + ',' + "施工" + ',' + "验收"+ ',' + "时间" ;
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await orderItemServiceDAO.queryItemService(query);

        for (let i = 0; i < rows.length; i++) {
            //订单号
            if (rows[i].order_id == null) {
                parkObj.orderId = '';
            } else {
                parkObj.orderId = rows[i].order_id;
            }

            //服务名称
            if (rows[i].sale_service_name == null) {
                parkObj.saleServiceName = '';
            } else {
                parkObj.saleServiceName = rows[i].sale_service_name;
            }

            //售价
            if (rows[i].fixed_price == null) {
                parkObj.fixedPrice = 0;
            } else {
                parkObj.fixedPrice = rows[i].fixed_price;
            }

            //折扣
            if (rows[i].discount_service_price == null) {
                parkObj.discountServicePrice = 0;
            } else {
                parkObj.discountServicePrice = rows[i].discount_service_price;
            }

            //实际价格
            if (rows[i].actual_service_price == null) {
                parkObj.actualServicePrice = 0;
            } else {
                parkObj.actualServicePrice = rows[i].actual_service_price;
            }

            //施工
            if (rows[i].deploy_user_name == null) {
                parkObj.deployUserName = 0;
            } else {
                parkObj.deployUserName = rows[i].deploy_user_name;
            }

            //验收
            if (rows[i].check_user_name == null) {
                parkObj.checkUserName = '';
            } else {
                parkObj.checkUserName = rows[i].check_user_name;
            }

            //时间
            if (rows[i].date_id == null) {
                parkObj.dateId = '';
            } else {
                parkObj.dateId = rows[i].date_id;
            }

            csvString = csvString + parkObj.orderId + "," + parkObj.saleServiceName + "," + parkObj.fixedPrice + "," +
                parkObj.discountServicePrice + "," + parkObj.actualServicePrice + "," + parkObj.deployUserName + "," +
                parkObj.checkUserName +"," + parkObj.dateId + '\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryItemServiceCsv ' + 'success');

    }catch (e) {
        logger.error(" queryItemServiceCsv error",e.stack);
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
    queryItemServiceCsv,
    addItemService,
    updateItemService,
    updateDeploy,
    updateCheck,
    updateStatus,
    deleteItemService
}