
const storageCheckDAO = require('../models/StorageCheckDAO');
const storageCheckRelDAO = require('../models/StorageCheckRelDAO');
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const serverLogger = require('../util/ServerLogger.js');
const systemConst = require('../util/SystemConst.js');
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

const queryStorageCheckRelCsv = async (req,res,next)=>{
    let path = req.params;

    try{

        let csvString = "";
        const header = "序号" + ',' + "盘点ID" + ','  + "仓库" + ',' +
            "仓库分区" + ',' + "商品名称" + ',' + "库存数量" + ',' + "盘库数量"  + ',' + "备注";
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await storageCheckRelDAO.queryStorageCheckRel({storageCheckId:path.storageCheckId});

        for (let i = 0; i < rows.length; i++) {
            //ID
            if (rows[i].id == null) {
                parkObj.id = 0;
            } else {
                parkObj.id = rows[i].id;
            }

            //盘点ID
            if (rows[i].storage_check_id == null) {
                parkObj.storageCheckId = 0;
            } else {
                parkObj.storageCheckId = rows[i].storage_check_id;
            }

            //仓库
            if (rows[i].storage_name == null) {
                parkObj.storageName = '';
            } else {
                parkObj.storageName = rows[i].storage_name;
            }

            //仓库分区
            if (rows[i].storage_area_name == null) {
                parkObj.storageAreaName = '';
            } else {
                parkObj.storageAreaName = rows[i].storage_area_name;
            }

            //商品名称
            if (rows[i].product_name == null) {
                parkObj.productName = 0;
            } else {
                parkObj.productName = rows[i].product_name;
            }

            //库存数量
            if (rows[i].storage_count == null) {
                parkObj.storageCount = 0;
            } else {
                parkObj.storageCount = rows[i].storage_count;
            }

            //盘库数量
            if (rows[i].check_count == null) {
                parkObj.checkCount = 0;
            } else {
                parkObj.checkCount = rows[i].check_count;
            }

            //备注
            if (rows[i].remark == null) {
                parkObj.remark = '';
            } else {
                parkObj.remark = rows[i].remark;
            }


            csvString = csvString + parkObj.id + "," + parkObj.storageCheckId + "," + parkObj.storageName + "," +
                parkObj.storageAreaName + "," + parkObj.productName + "," + parkObj.storageCount + "," +
                parkObj.checkCount + ","  + parkObj.remark + '\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryStorageCheckRelCsv ' + 'success');

    }catch (e) {
        logger.error(" queryStorageCheckRelCsv error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addStorageCheckRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.dateId = 0;
    try {
        params.dateId = params.storageDateId;
        params.purchaseId = 0;
        params.purchaseItemId = 0;
        params.storageCount = 0;
        params.orderId = 0;
        //创建 storage_product_rel
        const rowsProductRel = await storageProductRelDAO.addStorageProductRel(params);
        logger.info(' addStorageCheckRel addStorageProductRel ' + 'success');

        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.dateId = date;
        params.storageProductRelId = rowsProductRel[0].id;
        params.status = 2;
        params.checkStatus = systemConst.storageCheckStatus.not_normal;
        //创建 storage_check_rel
        const rowsRel = await storageCheckRelDAO.addStorageCheckRel(params);
        logger.info(' addStorageCheckRel ' + 'success');


        //更新计划盘点数量 plan_check_count , checked_count
        const rowUpdate = await storageCheckDAO.updatePlanCheckCountAndCheckedCount(
            {storageCheckId:params.storageCheckId });
        logger.info(' addStorageCheckRel updatePlanCheckCountAndCheckedCount ' + 'success');

        resUtil.resetCreateRes(res,rowsRel);
        return next();
    }catch (e) {
        logger.error(" addStorageCheck error ",e.stack);
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
    addStorageCheckRel,
    queryStorageCheckRel,
    queryStorageCheckRelCsv,
    updateStorageCheckRel,
    updateStatus
}