
const categoryDAO = require('../models/CategoryDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('CategoryModel.js');

const queryCategory = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await categoryDAO.queryCategory(query);
        const count = await categoryDAO.queryCategoryCount(query);
        logger.info(' queryCategory ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryCategory error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addCategory = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await categoryDAO.addCategory(params);
        logger.info(' addCategory ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addCategory error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateCategory = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.categoryId){
        params.categoryId = path.categoryId;
    }
    try{
        const rows = await categoryDAO.updateCategory(params);
        logger.info(' updateCategory ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateCategory error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.categoryId){
        params.categoryId = path.categoryId;
    }
    try{
        const rows = await categoryDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteCategory = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.categoryId){
        params.categoryId = path.categoryId;
    }
    try{
        const rows = await categoryDAO.deleteCategory(params);
        logger.info(' deleteCategory ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteCategory error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryCategory,
    addCategory,
    updateCategory,
    updateStatus,
    deleteCategory
}