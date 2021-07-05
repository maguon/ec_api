
const storageCheckDAO = require('../models/StorageCheckDAO');
const storageCheckRelDAO = require('../models/StorageCheckRelDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('StorageCheckRel.js');

const queryStorageCheckRel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageCheckRelDAO.queryStorageCheckRel(query);
        const count = await storageCheckRelDAO.queryStorageCheckRelCount(query);
        logger.info(' queryStorageCheckRel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryStorageCheckRel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStorageCheckRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageCheckRelId){
        params.storageCheckRelId = path.storageCheckRelId;
    }
    try{
        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.dateId = date;

        const rows = await storageCheckRelDAO.updateStorageCheckRel(params);
        logger.info(' updateStorageCheckRel ' + 'success');

        //查询 storage_check_id
        const rowsCheckId = await storageCheckRelDAO.queryStorageCheckRel({storageCheckRelId:path.storageCheckRelId});

        //更新 storageCheck checked_count
        const rowsCheckedCount = await storageCheckDAO.updateCheckedCount({storageCheckId:rowsCheckId[0].storage_check_id});

        //更新 storageCheck check_status
        const rowCheckStatus = await  storageCheckDAO.updateCheckStatus({storageCheckId:rowsCheckId[0].storage_check_id})

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStorageCheck error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageCheckRelId){
        params.storageCheckRelId = path.storageCheckRelId;
    }
    try{
        const rows = await storageCheckDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryStorageCheckRel,
    updateStorageCheckRel,
    updateStatus
}