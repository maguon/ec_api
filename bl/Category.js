
const categoryDAO = require('../models/CategoryDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const csv=require('csvtojson');
const fs = require('fs');
const logger = serverLogger.createLogger('Category.js');

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

const uploadCategoryFile = async (req,res,next)=>{
    let params = req.params;
    let successedInsert = 0;
    let failedCase = 0;
    let file = req.files.file;
    try {

        const objArray = await csv().fromFile(file.path);

        for(let i=0;i<objArray.length;i++){
            let subParams = {
                opUser:params.userId,
                categoryName : objArray[i].分类名称,
                remark : objArray[i].备注,
            }
            const rows = await categoryDAO.addCategory(subParams);
            if(rows.length >=1){
                successedInsert = successedInsert + rows.length;
            }
        }

        fs.unlink(file.path, function() {});
        failedCase=objArray.length-successedInsert;
        logger.info(' uploadCategoryFile ' + 'success');
        resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
        return next();

    }catch (e) {
        logger.error(" uploadCategoryFile error ",e.stack);
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
    uploadCategoryFile,
    updateCategory,
    updateStatus,
    deleteCategory
}