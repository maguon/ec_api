
const brandModelDAO = require('../models/BrandModelDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('BrandModel.js');

const queryBrandModel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await brandModelDAO.queryBrandModel(query);
        const count = await brandModelDAO.queryBrandModelCount(query);
        logger.info(' queryBrandModel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryBrandModel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addBrandModel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await brandModelDAO.addBrandModel(params);
        logger.info(' addBrandModel ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addBrandModel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateBrandModel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.brandModelId){
        params.brandModelId = path.brandModelId;
    }
    try{
        const rows = await brandModelDAO.updateBrandModel(params);
        logger.info(' updateBrandModel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateBrandModel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.brandModelId){
        params.brandModelId = path.brandModelId;
    }
    try{
        const rows = await brandModelDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteBrandModel = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.brandModelId){
        params.brandModelId = path.brandModelId;
    }
    try{
        const rows = await brandModelDAO.deleteBrandModel(params);
        logger.info(' deleteBrandModel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteBrandModels error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryBrandModel,
    addBrandModel,
    updateBrandModel,
    updateStatus,
    deleteBrandModel
}