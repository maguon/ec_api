
const purchaseDAO = require('../models/PurchaseDAO');
const purchaseItemDAO = require('../models/PurchaseItemDAO');
const purchaseRefundDAO = require('../models/PurchaseRefundDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('PurchaseRefund.js');

const queryPurchaseRefund = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseRefundDAO.queryPurchaseRefund(query);
        const count = await purchaseRefundDAO.queryPurchaseRefundCount(query);
        logger.info(' queryPurchaseRefund ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryPurchaseRefund error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addPurchaseRefund = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseId){
        params.purchaseId = path.purchaseId;
    }
    if(path.purchaseItemId){
        params.purchaseItemId = path.purchaseItemId;
    }
    params.status = sysConst.status.usable;
    params.paymentStatus = sysConst.status.usable;

    try {
        //计算 total_cost
        params.totalCost = params.refundUnitCost * params.refundCount - params.transferCost;

        //计算 refund_profile
        const rowsItem = await purchaseItemDAO.queryPurchaseItem({purchaseItemId:params.purchaseItemId});
        if(rowsItem.length <= 0){
            params.refundProfile = 0 - params.totalCost;
        }else{
            params.refundProfile = rowsItem[0].total_cost - params.totalCost;
        }

        const rows = await purchaseRefundDAO.addPurchaseRefund(params);
        logger.info(' addPurchaseRefund ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addPurchaseRefund error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePurchaseRefund = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseRefundId){
        params.purchaseRefundId = path.purchaseRefundId;
    }
    try{
        //计算 total_cost
        params.totalCost = params.refundUnitCost * params.refundCount - params.transferCost;

        //计算 refund_profile
        const rowsItem = await purchaseItemDAO.queryPurchaseItem({purchaseItemId:path.purchaseItemId});
        if(rowsItem.length <= 0){
            params.refundProfile = 0 - params.totalCost;
        }else{
            params.refundProfile = rowsItem[0].total_cost - params.totalCost;
        }

        const rows = await purchaseRefundDAO.updatePurchaseRefund(params);
        logger.info(' updatePurchaseRefund ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePurchaseRefund error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePaymentStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;

    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseRefundId){
        params.purchaseRefundId = path.purchaseRefundId;
    }
    if(params.paymentStatus == sysConst.paymentStatus.account_paid){
        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.dateId = date;
    }

    try{
        const rows = await purchaseRefundDAO.updatePaymentStatus(params);
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
    if(path.purchaseRefundId){
        params.purchaseRefundId = path.purchaseRefundId;
    }
    try{
        const rows = await purchaseRefundDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');

        if(params.status == sysConst.purchaseStatus.completed){
            let today = new Date();
            let date = moment(today).format('YYYYMMDD');
            params.finishDateId = date;
            const rowsDate = await purchaseDAO.updateFinishDateId(params);
            logger.info(' updateStatus updateFinishDateId ' + 'success');
        }

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPurchaseRefund,
    addPurchaseRefund,
    updatePurchaseRefund,
    updatePaymentStatus,
    updateStatus
}