
const storageDAO = require('../models/StorageDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Storage.js');

const queryStorage = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageDAO.queryStorage(query);
        const count = await storageDAO.queryStorageCount(query);
        logger.info(' queryStorage ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryStorage error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addStorage = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await storageDAO.addStorage(params);
        logger.info(' addStorage ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addStorage error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStorage = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageId){
        params.storageId = path.storageId;
    }
    try{
        const rows = await storageDAO.updateStorage(params);
        logger.info(' updateStorage ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStorage error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageId){
        params.storageId = path.storageId;
    }
    try{
        const rows = await storageDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteStorage = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.storageId){
        params.storageId = path.storageId;
    }
    try{
        const rows = await storageDAO.deleteStorage(params);
        logger.info(' deleteStorage ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteStorage error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryStorage,
    addStorage,
    updateStorage,
    updateStatus,
    deleteStorage
}