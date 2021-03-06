
const purchaseDAO = require('../models/PurchaseDAO');
const purchaseItemDAO = require('../models/PurchaseItemDAO');
const productDAO = require('../models/ProductDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Purchase.js');

const queryPurchase = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseDAO.queryPurchase(query);
        const count = await purchaseDAO.queryPurchaseCount(query);
        logger.info(' queryPurchase ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryPurchase error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryPurchaseAndItem = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseDAO.queryPurchaseAndItem(query);
        const count = await purchaseDAO.queryPurchaseAndItemCount(query);
        logger.info(' queryPurchaseAndItem ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryPurchaseAndItem error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addPurchase = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    params.storageStatus = sysConst.status.usable;
    params.paymentStatus = sysConst.status.usable;

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.planDateId = date;

    try {
        //创建purchase_info
        const rows = await purchaseDAO.addPurchase(params);

        //创建成功，创建purchase_item_info
        for(var i=0;i<params.purchaseItem.length;i++){
            params.purchaseItem[i].status = sysConst.status.usable;
            params.purchaseItem[i].storageStatus = sysConst.status.usable;
            params.purchaseItem[i].paymentStatus = sysConst.status.usable;
            if(path.userId){
                params.purchaseItem[i].opUser =  path.userId;
            }
            params.purchaseItem[i].supplierId = params.supplierId;
            params.purchaseItem[i].purchaseId = rows[0].id;
            params.purchaseItem[i].orderId = params.orderId;

            const itemRowsAdd = await purchaseItemDAO.addPurchaseItem(params.purchaseItem[i]);
            logger.info(' addPurchase addPurchaseItem id=' + itemRowsAdd[0].id + ' success');

        }

        //更新purchase_info ： product_cost，total_cost
        const updateRows = await purchaseDAO.updateTotalCost({purchaseId:rows[0].id});
        logger.info(' addPurchase updateTotalCost success');

        logger.info(' addPurchase ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addPurchase error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePurchase = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseId){
        params.purchaseId = path.purchaseId;
    }
    try{
        const rows = await purchaseDAO.updatePurchase(params);
        logger.info(' updatePurchase ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePurchase error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStorageStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseId){
        params.purchaseId = path.purchaseId;
    }
    try{
        const rows = await purchaseDAO.updateStorageStatus(params);
        logger.info(' updateStorageStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStorageStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePaymentStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;

    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseId){
        params.purchaseId = path.purchaseId;
    }
    if(params.paymentStatus == sysConst.paymentStatus.account_paid){
        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.paymentDateId = date;
    }

    try{
        const rows = await purchaseDAO.updatePaymentStatus(params);
        logger.info(' updatePaymentStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePaymentStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseId){
        params.purchaseId = path.purchaseId;
    }
    try{
        const rows = await purchaseDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');

        if(params.status == sysConst.purchaseStatus.completed){
            let today = new Date();
            let date = moment(today).format('YYYYMMDD');
            params.finishDateId = date;
            const rowsDate = await purchaseDAO.updateFinishDateId(params);
            logger.info(' updateStatus updateFinishDateId ' + 'success');

            //更新 product_info ：last_purchase_price
            const rowsPrice = await productDAO.updateLastPrice(params);
            logger.info(' updateStatus updateLastPrice ' + 'success');
        }

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
        const rows = await purchaseDAO.queryStat(query);
        logger.info(' queryStat ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryStat error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPurchase,
    queryPurchaseAndItem,
    addPurchase,
    updatePurchase,
    updateStorageStatus,
    updatePaymentStatus,
    updateStatus,
    queryStat
}