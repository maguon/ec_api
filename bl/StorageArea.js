
const storageAreaDAO = require('../models/StorageAreaDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('StorageArea.js');

const queryStorageArea = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageAreaDAO.queryStorageArea(query);
        const count = await storageAreaDAO.queryStorageAreaCount(query);
        logger.info(' queryStorageArea ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryStorageArea error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addStorageArea = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await storageAreaDAO.addStorageArea(params);
        logger.info(' addStorageArea ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addStorageArea error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStorageArea = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageAreaId){
        params.storageAreaId = path.storageAreaId;
    }
    try{
        const rows = await storageAreaDAO.updateStorageArea(params);
        logger.info(' updateStorageArea ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStorageArea error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageAreaId){
        params.storageAreaId = path.storageAreaId;
    }
    try{
        const rows = await storageAreaDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteStorageArea = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.storageAreaId){
        params.storageAreaId = path.storageAreaId;
    }
    try{
        const rows = await storageAreaDAO.deleteStorageArea(params);
        logger.info(' deleteStorageArea ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteStorageArea error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryStorageArea,
    addStorageArea,
    updateStorageArea,
    updateStatus,
    deleteStorageArea
}