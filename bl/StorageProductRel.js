
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

const queryStorageProductRelCsv = async (req,res,next)=>{
    let query = req.query;
    try {

        let csvString = "";
        const header = "仓库" + ',' + "仓库分区" + ',' + "供应商" + ',' +
            "商品名称" + ',' + "单位成本" + ',' + "库存" + ',' + "仓储日期";
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await storageProductRelDAO.queryStorageProductRel(query);

        for (let i = 0; i < rows.length; i++) {
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

            //供应商
            if (rows[i].supplier_name == null) {
                parkObj.supplierName = '';
            } else {
                parkObj.supplierName = rows[i].supplier_name;
            }

            //商品名称
            if (rows[i].product_name == null) {
                parkObj.productName = '';
            } else {
                parkObj.productName = rows[i].product_name;
            }

            //单位成本
            if (rows[i].unit_cost == null) {
                parkObj.unitCost = 0;
            } else {
                parkObj.unitCost = rows[i].unit_cost;
            }

            //库存
            if (rows[i].storage_count == null) {
                parkObj.storageCount = 0;
            } else {
                parkObj.storageCount = rows[i].storage_count;
            }

            //仓库日期
            parkObj.dateId = rows[i].date_id;

            csvString = csvString + parkObj.storageName + "," + parkObj.storageAreaName + "," + parkObj.supplierName + "," +
                parkObj.productName + "," + parkObj.unitCost + "," + parkObj.storageCount + "," + parkObj.dateId + '\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryStorageProductRelCsv ' + 'success');

    }catch (e) {
        logger.error(" queryStorageProductRelCsv error",e.stack);
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

const queryStat = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await storageProductRelDAO.queryStat(query);
        logger.info(' queryStat ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryStat error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryStorageProductRel,
    queryStorageProductRelCsv,
    addStorageProductRel,
    updateStorageProductRel,
    queryStat
}