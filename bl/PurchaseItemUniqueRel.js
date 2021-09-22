
const purchaseItemUniqueRelDAO = require('../models/PurchaseItemUniqueRelDAO');
const purchaseItemDAO = require('../models/PurchaseItemDAO');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('PurchaseItemUniqueRel.js');

const queryUniqueRel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await purchaseItemUniqueRelDAO.queryUniqueRel(query);
        const count = await purchaseItemUniqueRelDAO.queryUniqueRelCount(query);
        logger.info(' queryUniqueRel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryUniqueRel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addUniqueRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    let returnCount = 0;
    try {
        for(let i=0; i < params.uniqueIdArray.length; i++){
            let uniqueObj = {};
            if(path.userId){
                uniqueObj.opUser = path.userId;
            }
            if(path.purchaseItemId){
                uniqueObj.purchaseItemId = path.purchaseItemId;
            }
            if(path.productId ){
                uniqueObj.productId  = path.productId ;
            }
            if(params.purchaseId){
                uniqueObj.purchaseId = params.purchaseId;
            }
            if(params.productName ){
                uniqueObj.productName  = params.productName ;
            }
            uniqueObj.uniqueId = params.uniqueIdArray[i]
            const rows = await purchaseItemUniqueRelDAO.addUniqueRel(uniqueObj);
            if(rows.length>=1){
                returnCount += 1;
                logger.info(' UniqueRel ' + 'success');
            }

            //如果成功更新 product_item unique_flage
            params.uniqueFlag = 1;
            const rowsItem = await purchaseItemDAO.updateUniqueFlag(uniqueObj);
            logger.info(' UniqueRel updateUniqueFlag ' + 'success');
        }
        resUtil.resetCreateRes(res,returnCount);
        return next();
    }catch (e) {
        logger.error(" UniqueRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseItemId){
        params.purchaseItemId = path.purchaseItemId;
    }
    if(path.productId ){
        params.productId  = path.productId ;
    }
    try{
        const rows = await purchaseItemUniqueRelDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteUniqueRel = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseItemUniqueRelId ){
        params.uniqueRelId = path.purchaseItemUniqueRelId ;
    }
    if(path.purchaseItemId){
        params.purchaseItemId = path.purchaseItemId;
    }
    if(path.productId ){
        params.productId  = path.productId ;
    }
    try{
        const rows = await purchaseItemUniqueRelDAO.deleteUniqueRel(params);
        logger.info(' deleteUniqueRel ' + 'success');
        if(rows.length <= 0){
            resUtil.resetFailedRes(res,{message:'删除失败！'});
            return next();
        }

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteUniqueRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryUniqueRel,
    addUniqueRel,
    updateStatus,
    deleteUniqueRel
}