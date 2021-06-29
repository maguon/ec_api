
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('StorageProductRelDetail.js');

const queryStorageProductRelDetail = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageProductRelDetailDAO.queryStorageProductRelDetail(query);
        const count = await storageProductRelDetailDAO.queryStorageProductRelDetailCount(query);
        logger.info(' queryStorageProductRelDetail ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryStorageProductRelDetail error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addStorageProductRelDetail = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageProductRelId){
        params.storageProductRelId = path.storageProductRelId;
    }
    params.status = sysConst.status.usable;

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
        logger.info(' addStorageProductRelDetail ' + 'success');

        if(rows.length >= 1){
            if(params.storageType == sysConst.storageType.export){
                params.storageCount = -params.storageCount;
            }
            const rowsRel = await storageProductRelDAO.updateStorageCount(params);
            logger.info(' addStorageProductRelDetail updateStorageCount ' + 'success');
        }
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addStorageProductRelDetail error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryStorageProductRelDetail,
    addStorageProductRelDetail
}