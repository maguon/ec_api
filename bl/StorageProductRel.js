
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('StorageProductRel.js');

const queryStorageProductRel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageProductRelDAO.queryStorageProductRel(query);
        const count = await storageProductRelDAO.queryStorageProductRelCount(query);
        logger.info(' queryStorageProductRel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryStorageProductRel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addStorageProductRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageId){
        params.storageId = path.storageId;
    }
    if(path.productId){
        params.productId = path.productId;
    }
    params.status = sysConst.status.usable;

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await storageProductRelDAO.addStorageProductRel(params);
        logger.info(' addStorageProductRel ' + 'success');

        //新增 storage_product_rel_detail
        params.storageProductRelId = rows[0].id;
        const rowsDetail = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
        logger.info(' addStorageProductRel addStorageProductRelDetail ' + 'success');

        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addStorageProductRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStorageProductRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageProductRelId){
        params.storageProductRelId = path.storageProductRelId;
    }
    try{
        const rows = await storageProductRelDAO.updateStorageProductRel(params);
        logger.info(' updateStorageProductRel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStorageProductRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}


module.exports = {
    queryStorageProductRel,
    addStorageProductRel,
    updateStorageProductRel
}