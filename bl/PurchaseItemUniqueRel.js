
const purchaseItemUniqueRelDAO = require('../models/PurchaseItemUniqueRelDAO');
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
    let returnRows = [];
    try {
        for(let i=0; i < params.uniqueRelArray.length; i++){
            if(path.userId){
                params.uniqueRelArray[i].opUser = path.userId;
            }
            if(path.purchaseItemId){
                params.uniqueRelArray[i].purchaseItemId = path.purchaseItemId;
            }
            const rows = await purchaseItemUniqueRelDAO.addUniqueRel(params.uniqueRelArray[i]);
            returnRows.push({"id":rows[0].id});
            logger.info(' UniqueRel ' + 'success');
        }
        resUtil.resetCreateRes(res,returnRows);
        return next();
    }catch (e) {
        logger.error(" UniqueRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.purchaseItemUniqueRelId){
        params.uniqueRelId = path.purchaseItemUniqueRelId;
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
    if(path.purchaseItemUniqueRelId ){
        params.uniqueRelId = path.purchaseItemUniqueRelId ;
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