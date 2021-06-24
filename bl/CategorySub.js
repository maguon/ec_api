
const categorySubDAO = require('../models/CategorySubDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('CategorySubModel.js');

const queryCategorySub = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await categorySubDAO.queryCategorySub(query);
        const count = await categorySubDAO.queryCategorySubCount(query);
        logger.info(' queryCategorySub ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryCategorySub error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addCategorySub = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await categorySubDAO.addCategorySub(params);
        logger.info(' addCategorySubs ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addCategorySub error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateCategorySub = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.categorySubId){
        params.categorySubId = path.categorySubId;
    }
    try{
        const rows = await categorySubDAO.updateCategorySub(params);
        logger.info(' updateCategorySub ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateCategorySub error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.categorySubId){
        params.categorySubId = path.categorySubId;
    }
    try{
        const rows = await categorySubDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteCategorySub = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.categorySubId){
        params.categorySubId = path.categorySubId;
    }
    try{
        const rows = await categorySubDAO.deleteCategorySub(params);
        logger.info(' deleteCategorySub ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteCategorySub error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryCategorySub,
    addCategorySub,
    updateCategorySub,
    updateStatus,
    deleteCategorySub
}