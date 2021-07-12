
const storageCheckDAO = require('../models/StorageCheckDAO');
const storageCheckRelDAO = require('../models/StorageCheckRelDAO');
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
const serverLogger = require('../util/ServerLogger.js');
const systemConst = require('../util/SystemConst.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('StorageCheck.js');

const queryStorageCheck = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageCheckDAO.queryStorageCheck(query);
        const count = await storageCheckDAO.queryStorageCheckCount(query);
        logger.info(' queryStorageCheck ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryStorageCheck error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addStorageCheck = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.dateId = 0;
    try {
        //创建 storage_check
        const rows = await storageCheckDAO.addStorageCheck(params);
        logger.info(' addStorageCheck ' + 'success');

        params.storageCheckId = rows[0].id;
        //根据条件创建 storage_check_rel
        const rowsRel = await storageCheckRelDAO.addStorageCheckRel(params);
        logger.info(' addStorageCheck addStorageCheckRel ' + 'success');

        //更新计划盘点数量 plan_check_count
        const rowUpdate = await storageCheckDAO.updatePlanCheckCount(
            {opUser:path.userId,planCheckCount:rowsRel.length,storageCheckId:rows[0].id});
        logger.info(' addStorageCheck updatePlanCheckCount ' + 'success');

        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addStorageCheck error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStorageCheck = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageCheckId ){
        params.storageCheckId  = path.storageCheckId ;
    }
    try{
        const rows = await storageCheckDAO.updateStorageCheck(params);
        logger.info(' updateStorageCheck ' + 'success');
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
    if(path.storageCheckId){
        params.storageCheckId = path.storageCheckId;
    }
    try{
        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.dateId = date;

        const rows = await storageCheckDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');

        if(params.status = 2){
            //更新库存数量
            const rowsStroageProductRel = await storageProductRelDAO.updateStorageCountByStorageCheckId({
                storageCheckId: params.storageCheckId});
            logger.info(' updateStatus updateStorageCountByStorageCheckId ' + 'success');

            //添加 storage_product_rel_detail
            const rowsStrageProductRelDetail = await storageProductRelDetailDAO.addStorageProductRelDetailByStorageCheck(params);
            logger.info(' updateStatus addStorageProductRelDetailByStorageCheck ' + 'success');
        }

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateCheckStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageCheckId){
        params.storageCheckId = path.storageCheckId;
    }
    try{
        const rows = await storageCheckDAO.updateCheckStatus(params);
        logger.info(' updateCheckStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateCheckStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryStat = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageCheckDAO.queryStat(query);
        logger.info(' queryStat ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryStat error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryStorageCheck,
    addStorageCheck,
    updateStorageCheck,
    updateStatus,
    updateCheckStatus,
    queryStat
}