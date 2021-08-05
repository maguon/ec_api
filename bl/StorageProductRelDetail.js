
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
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

const queryStorageProductRelDetailCsv = async (req,res,next)=>{
    let query = req.query;
    try{

        let csvString = "";
        const header = "仓库" + ',' + "仓库分区" + ',' + "供应商"+ ',' + "采购单号"  + ',' + "商品"+ ',' + "数量" + ',' +
            "操作" + ',' + "操作原因" + ',' + "操作员" + ',' + "操作日期" ;
        csvString = header + '\r\n' + csvString;
        let parkObj = {};

        const rows = await storageProductRelDetailDAO.queryStorageProductRelDetail(query);

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

            //采购单号
            if (rows[i].purchase_id == null) {
                parkObj.purchaseId = '';
            } else {
                parkObj.purchaseId = rows[i].purchase_id;
            }

            //商品
            if (rows[i].product_name == null) {
                parkObj.productName = '';
            } else {
                parkObj.productName = rows[i].product_name;
            }

            //数量
            if (rows[i].storage_count == null) {
                parkObj.storageCount = '';
            } else {
                parkObj.storageCount = rows[i].storage_count;
            }

            //操作
            if (rows[i].storage_type == null) {
                parkObj.storageType = '';
            } else {
                if(rows[i].storage_type == sysConst.storageType.import){
                    parkObj.storageType = '入库';
                }else{
                    parkObj.storageType = '出库';
                }
            }

            //操作原因
            if (rows[i].storage_sub_type == null) {
                parkObj.storageSubType = '';
            } else {
                parkObj.storageSubType = stroageTypeConst(rows[i].storage_sub_type);
            }

            //操作员
            if (rows[i].real_name == null) {
                parkObj.realName = '';
            } else {
                parkObj.realName = rows[i].real_name;
            }

            //操作日期
            if (rows[i].created_on == null) {
                parkObj.createdOn = 0;
            } else {
                parkObj.createdOn =  moment(rows[i].created_on).format(' YYYY-MM-DD HH:mm:ss');
            }

            csvString = csvString + parkObj.storageName + "," + parkObj.storageAreaName + "," + parkObj.supplierName + "," +
                parkObj.purchaseId + "," + parkObj.productName + "," + parkObj.storageCount + "," + parkObj.storageType + "," +parkObj.storageSubType + "," +
                parkObj.realName + "," + parkObj.createdOn + '\r\n';

        }

        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryStorageProductRelDetailCsv ' + 'success');

    }catch (e) {
        logger.error(" queryStorageProductRelDetailCsv error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

function stroageTypeConst(storageSubType){

    let returnMsg = '未知';
    const storageType = parseInt(storageSubType/10);
    if(storageType == sysConst.storageType.import){
        if(storageSubType == sysConst.storageImportType.purchaseImport){
            returnMsg = "采购入库";
        }
        if(storageSubType == sysConst.storageImportType.storageMoveImport){
            returnMsg = "移库入库";
        }
        if(storageSubType == sysConst.storageImportType.storageCountImport){
            returnMsg = "盘盈入库";
        }
        if(storageSubType == sysConst.storageImportType.orderBackImport){
            returnMsg = "退单入库";
        }
        if(storageSubType == sysConst.storageImportType.innerBackImport){
            returnMsg = "内部退料入库";
        }
    }else{
        if(storageSubType == sysConst.storageExportType.purchaseExport){
            returnMsg = "采购退货出库";
        }
        if(storageSubType == sysConst.storageExportType.storageMoveExport){
            returnMsg = "移库出库";
        }
        if(storageSubType == sysConst.storageExportType.storageCountExport){
            returnMsg = "盘盈出库";
        }
        if(storageSubType == sysConst.storageExportType.orderExport){
            returnMsg = "订单出库";
        }
        if(storageSubType == sysConst.storageExportType.innerExport){
            returnMsg = "内部领料出库";
        }
    }

    return returnMsg;
}

//退料、退单入库
const addRelDetailImport = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageProductRelId){
        params.storageProductRelId = path.storageProductRelId;
    }

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
        logger.info(' addRelDetailImport ' + 'success');

        if(rows.length >= 1){
            //查询storage_product_rel 原库是否存在旧货
            if(params.oldFlag == undefined){
                params.oldFlag = 0;
            }
            const rowsOld = await storageProductRelDAO.queryStorageProductRel({storageProductRelId:path.storageProductRelId});
            logger.info(' addRelDetailImport queryStorageProductRel ' + 'success');

            if(rowsOld[0].old_flag == params.oldFlag){
                //返回原来仓位
                const rowsRel = await storageProductRelDAO.updateStorageCount(params);
                logger.info(' addRelDetailImport updateStorageCount ' + 'success');
            }else{
                //与原仓位，商品旧货状态不同，创建新仓库信息
                params.opUser = path.userId;
                params.remark = params.remark;
                params.storageId = rowsOld[0].storage_id;
                params.storageAreaId = rowsOld[0].storage_area_id;
                params.supplierId = rowsOld[0].supplier_id;
                params.productId = rowsOld[0].product_id;
                params.productName = rowsOld[0].product_name;
                params.purchaseId = rowsOld[0].purchase_id;
                params.purchaseItemId = rowsOld[0].purchase_item_id;
                params.unitCost = rowsOld[0].unit_cost;
                params.orderId = rowsOld[0].order_id;

                const rowsAddRel = await storageProductRelDAO.addStorageProductRel(params);
                logger.info(' addRelDetailImport addStorageProductRel ' + 'success');
            }

        }else{
            resUtil.resetFailedRes(res,{message:'创建失败！'});
            return next();
        }

        if(params.orderProdId){
            params.orderItemProdId = params.orderProdId;
            params.status = sysConst.prodItemStatus.complete;
            //更新 order_item_prod status
            const rowsStatus = await orderItemProdDAO.updateStatus(params);
            logger.info(' addRelDetailImport updateStatus ' + 'success');
        }

        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addRelDetailImport error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

//领料、订单出库
const addRelDetailExport = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.storageProductRelId){
        params.storageProductRelId = path.storageProductRelId;
    }

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
        logger.info(' addRelDetailExport ' + 'success');

        if(rows.length >= 1){
            params.storageCount = -params.storageCount;
            const rowsRel = await storageProductRelDAO.updateStorageCount(params);
            logger.info(' addRelDetailExport updateStorageCount ' + 'success');
        }else{
            resUtil.resetFailedRes(res,{message:'创建失败！'});
            return next();
        }

        if(params.orderProdId){
            params.orderItemProdId = params.orderProdId;
            params.status = sysConst.prodItemStatus.complete;
            //更新 order_item_prod status
            const rowsStatus = await orderItemProdDAO.updateStatus(params);
            logger.info(' addRelDetailExport updateStatus ' + 'success');
        }

        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addRelDetailExport error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryStorageProductRelDetail,
    queryStorageProductRelDetailCsv,
    addRelDetailImport,
    addRelDetailExport
}