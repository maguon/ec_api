
const purchaseDAO = require('../models/PurchaseDAO');
const purchaseItemDAO = require('../models/PurchaseItemDAO');
const serverLogger = require('../util/ServerLogger.js');
const dateUtil = require('../util/DateUtil.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
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


module.exports = {
    queryPurchaseItem,
    updatePurchaseItem,
    updateStatus
}