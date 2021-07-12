
const purchaseItemDAO = require('../models/PurchaseItemDAO');
const purchaseRefundDAO = require('../models/PurchaseRefundDAO');
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
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
            params.refundProfile = ( params.refundUnitCost - rowsItem[0].unit_cost ) * params.refundCount - params.transferCost ;
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
            params.refundProfile = ( params.refundUnitCost - rowsItem[0].unit_cost ) * params.refundCount - params.totalCost;
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
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateRefundStorage = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseRefundId){
        params.purchaseRefundId = path.purchaseRefundId;
    }
    if(path.storageProductRelId){
        params.storageProductRelId = path.storageProductRelId;
    }

    try{
        //查询退款信息
        const rows = await purchaseRefundDAO.queryPurchaseRefund(params);
        logger.info(' updateRefundStorage queryPurchaseRefund ' + 'success');
        params.refundCount = Number.parseInt(rows[0].refund_count);

        //判断库存数量是否可以出库
        const rowsStorageProductRel = await storageProductRelDAO.updateStorageCountByRefund(params);
        logger.info(' updateRefundStorage updateStorageCount ' + 'success');

        if(rowsStorageProductRel.length <=0){
            resUtil.resetFailedRes(res,{message:'库存数量不足！'});
            return next();
        }

        params.supplierId = rows[0].supplier_id;
        params.productId = rows[0].product_id;
        params.purchaseId = rows[0].purchase_id;
        params.purchaseItemId = rows[0].purchase_item_id;
        params.storageType = sysConst.storageType.export;
        params.storageSubType = sysConst.storageExportType.purchaseExport;

        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.dateId = date;

        //创建 storage_product_rel_detail
        const rowsDetail = await  storageProductRelDetailDAO.addStorageProductRelDetailByStorageProductRel(params);
        logger.info(' updateRefundStorage rowsDetail ' + 'success');

        //更新退款信息
        const rowsRefund = await purchaseRefundDAO.updateStorageRelId({
            opUser:path.userId , storageRelId:rowsDetail[0].id , purchaseRefundId:path.purchaseRefundId});
        logger.info(' updateRefundStorage updateStorageRelId ' + 'success');

        resUtil.resetUpdateRes(res,rowsRefund);
        return next();
    }catch (e) {
        logger.error(" updateRefundStorage error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryStat = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseRefundDAO.queryStat(query);
        logger.info(' queryStat ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryStat error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPurchaseRefund,
    addPurchaseRefund,
    updatePurchaseRefund,
    updatePaymentStatus,
    updateStatus,
    updateRefundStorage,
    queryStat
}