
const purchaseDAO = require('../models/PurchaseDAO');
const purchaseItemDAO = require('../models/PurchaseItemDAO');
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
const serverLogger = require('../util/ServerLogger.js');
const systemConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const moment = require('moment');
const logger = serverLogger.createLogger('PurchaseItem.js');

const queryPurchaseItem = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseItemDAO.queryPurchaseItem(query);
        const count = await purchaseItemDAO.queryPurchaseItemCount(query);
        logger.info(' queryPurchaseItem ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryPurchaseItem error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryPurchaseItemStorage = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseItemDAO.queryPurchaseItemStorage(query);
        const count = await purchaseItemDAO.queryPurchaseItemStorageCount(query);
        logger.info(' queryPurchaseItemStorage ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryPurchaseItemStorage error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePurchaseItem = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseItemId){
        params.purchaseItemId = path.purchaseItemId ;
    }
    try{
        const rows = await purchaseItemDAO.updatePurchaseItem(params);
        logger.info(' updatePurchaseItem ' + 'success');

        //查询当前采购单号
        const rowsQuery = await purchaseItemDAO.queryPurchaseItem(params);
        logger.info(' updatePurchaseItem queryPurchaseItem success');

        //更新purchase_info ： product_cost，total_cost
        const updateRows = await purchaseDAO.updateTotalCost({purchaseId:rowsQuery[0].purchase_id});
        logger.info(' updatePurchaseItem updateTotalCost success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePurchaseItem error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStorageStatus = async (req,res,next)=>{
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
    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try{

        params.storageStatus = systemConst.storageStatus.put_in;
        //更新 purchase_item storage_status 未入库时更新为已入库
        const rowsItem = await purchaseItemDAO.updateStorageStatus(params);
        logger.info(' updateStorageStatus ' + 'success');

        if(rowsItem.length <=0){
            resUtil.resetFailedRes(res,{message:'更新失败！'});
            return next();
        }

        //创建 StorageProductRel
        const rowsRel = await storageProductRelDAO.addStorageProductRelByPurchaseItem(params);
        logger.info(' updateStorageStatus addStorageProductRel ' + 'success');

        params.storageType = systemConst.storageType.import;
        params.storageSubType = systemConst.storageImportType.purchaseImport;
        if(rowsRel.length < 1){
            resUtil.resetFailedRes(res,{message:'商品未验收，无法入库！'});
            return next();
        }
        params.storageProductRelId = rowsRel[0].id;
        //创建 StorageProductRelDetail
        const rowsRelDetail = await storageProductRelDetailDAO.addStorageProductRelDetailByPurchaseItem(params);

        //更新 purchase_info 下所有的都入库了，更新storage_status
        const rowsInfo = await purchaseDAO.updateStorageStatusByItem(params);
        logger.info(' updateStorageStatus updateStorageStatusByItem ' + 'success');
        resUtil.resetUpdateRes(res,rowsItem);
        return next();

    }catch (e) {
        logger.error(" updateStorageStatus error ",e.stack);
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
        const rows = await purchaseItemDAO.queryStat(query);
        logger.info(' queryStat ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryStat error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPurchaseItem,
    queryPurchaseItemStorage,
    updatePurchaseItem,
    updateStorageStatus,
    updateStatus,
    queryStat
}