
const brandDAO = require('../models/BrandDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const csv=require('csvtojson');
const fs = require('fs');
const logger = serverLogger.createLogger('Brand.js');

const queryBrand = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await brandDAO.queryBrand(query);
        const count = await brandDAO.queryBrandCount(query);
        logger.info(' queryBrand ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryBrand error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addBrand = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    try {
        const rows = await brandDAO.addBrand(params);
        logger.info(' addBrand ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addBrand error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const uploadBrandFile = async (req,res,next)=>{
    let params = req.params;
    let successedInsert = 0;
    let failedCase = 0;
    let file = req.files.file;
    try {

        const objArray = await csv().fromFile(file.path);

        for(let i=0;i<objArray.length;i++){
            let subParams = {
                opUser:params.userId,
                brandName : objArray[i].品牌名称,
                remark : objArray[i].备注,
            }
            const rows = await brandDAO.addBrand(subParams);
            if(rows.length >=1){
                successedInsert = successedInsert + rows.length;
            }
        }

        fs.unlink(file.path, function() {});
        failedCase=objArray.length-successedInsert;
        logger.info(' uploadBrandFile ' + 'success');
        resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
        return next();

    }catch (e) {
        logger.error(" uploadBrandFile error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateBrand = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.brandId){
        params.brandId = path.brandId;
    }
    try{
        const rows = await brandDAO.updateBrand(params);
        logger.info(' updateBrand ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateBrand error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.brandId){
        params.brandId = path.brandId;
    }
    try{
        const rows = await brandDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteBrand = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.brandId){
        params.brandId = path.brandId;
    }
    try{
        const rows = await brandDAO.deleteBrand(params);
        logger.info(' deleteBrand ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteBrand error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryBrand,
    addBrand,
    uploadBrandFile,
    updateBrand,
    updateStatus,
    deleteBrand
}