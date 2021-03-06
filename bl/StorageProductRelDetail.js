
const storageProductRel = require('../bl/StorageProductRel');
const storageProductRelDAO = require('../models/StorageProductRelDAO');
const storageProductRelDetailDAO = require('../models/StorageProductRelDetailDAO');
const orderItemProdDAO = require('../models/OrderItemProdDAO');
const orderRefundProdDAO = require('../models/OrderRefundProdDAO');
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
            "操作" + ',' + "操作原因" + ',' + "操作员" + ',' + "操作日期" + ',' + "是否编码" + ',' + "编码";
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

            //是否编码
            if (rows[i].unique_flag == 1) {
                parkObj.uniqueFlag = '是';
            } else {
                parkObj.uniqueFlag = '否';
            }

            //编码
            if (rows[i].prod_unique_arr == null) {
                parkObj.prodUniqueId = '';
            } else {
                parkObj.prodUniqueId = rows[i].prod_unique_arr.join().replace(/,/g,"|");
            }

            csvString = csvString + parkObj.storageName + "," + parkObj.storageAreaName + "," + parkObj.supplierName + "," +
                parkObj.purchaseId + "," + parkObj.productName + "," + parkObj.storageCount + "," + parkObj.storageType + "," +parkObj.storageSubType + "," +
                parkObj.realName + "," + parkObj.createdOn + "," + parkObj.uniqueFlag + "," + parkObj.prodUniqueId +  '\r\n';

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
        if(params.storageSubType == sysConst.storageImportType.orderBackImport){
            //退单入库
            if(params.orderRefundId){
                if(params.orderRefundProdId){
                    params.orderRefundProdId = params.orderRefundProdId;
                    params.status = sysConst.prodRefundStatus.complete;
                    //更新 order_refund_prod status
                    const rowsStatus = await orderRefundProdDAO.updateStatus(params);
                    logger.info(' addRelDetailImport updateStatus ' + 'success');
                }else{
                    resUtil.resetFailedRes(res,{message:'缺少退单商品编号，入库失败！'});
                    return next();
                }

            }else{
                resUtil.resetFailedRes(res,{message:'缺少退单号，入库失败！'});
                return next();
            }
        }else{
            //退料
            params.orderId = null;
            params.orderRefundId = null;
            params.orderRefundProdId = null;
        }
        params.orderProdId = null;


        //查询storage_product_rel 原库是否存在旧货
        if(params.oldFlag == undefined){
            params.oldFlag = 0;
        }
        //query rel
        const rowsOld = await storageProductRelDAO.queryStorageProductRel({storageProductRelId:path.storageProductRelId});
        logger.info(' addRelDetailImport queryStorageProductRel ' + 'success');

        if(rowsOld[0].old_flag == params.oldFlag){
            //返回原来仓位
            //update storage_count and prodUniqueArr
            const rowsUpdateRel = await storageProductRel.updateStorageProdRelCount(path.storageProductRelId,sysConst.storageType.import,
                params.storageCount,(params.prodUniqueArr?params.prodUniqueArr:null));
            logger.info(' addRelDetailImport updateStorageProdRelCount ' + 'success');

            if(rowsUpdateRel.success){
                //add detail
                const rows = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
                logger.info(' addRelDetailImport addStorageProductRelDetail ' + 'success');

                resUtil.resetCreateRes(res,rows);
                return next();
            }else{
                resUtil.resetFailedRes(res,{message:'入库更新失败！'});
                return next();
            }

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
            params.prodUniqueArr = (params.prodUniqueArr?params.prodUniqueArr:null);

            //add rel info
            const rowsAddRel = await storageProductRelDAO.addStorageProductRel(params);
            logger.info(' addRelDetailImport addStorageProductRel ' + 'success');

            if(rowsAddRel.length>0){
                //add detail
                const rows = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
                logger.info(' addRelDetailImport addStorageProductRelDetail ' + 'success');

                resUtil.resetCreateRes(res,rows);
                return next();
            }else{
                resUtil.resetFailedRes(res,{message:'入库更新失败！'});
                return next();
            }
        }

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
        if(params.storageSubType == sysConst.storageExportType.orderExport){
            //订单出库
            if(params.orderId){
                if(params.orderProdId){
                    params.orderItemProdId = params.orderProdId;
                    params.status = sysConst.prodItemStatus.complete;
                    //更新 order_item_prod status
                    const rowsStatus = await orderItemProdDAO.updateStatus(params);
                    logger.info(' addRelDetailExport updateStatus ' + 'success');
                }else{
                    resUtil.resetFailedRes(res,{message:'缺少商品编号，出库失败！'});
                    return next();
                }

            }else{
                resUtil.resetFailedRes(res,{message:'缺少单号，出库失败！'});
                return next();
            }
        }else{
            //领料
            params.orderId = null;
            params.orderProdId = null;
        }

        params.orderRefundId = null;
        params.orderRefundProdId = null;

        //update rel
        const rowsUpdateRel = await storageProductRel.updateStorageProdRelCount(path.storageProductRelId,sysConst.storageType.export,
            params.storageCount,(params.prodUniqueArr?params.prodUniqueArr:null));
        logger.info(' addRelDetailExport updateStorageProdRelCount ' + 'success');

        if(rowsUpdateRel.success){
            //add detail
            const rows = await storageProductRelDetailDAO.addStorageProductRelDetail(params);
            logger.info(' addRelDetailExport ' + 'success');

            resUtil.resetCreateRes(res,rows);
            return next();
        }else{
            resUtil.resetFailedRes(res,{message:'出库更新失败！'});
            return next();
        }

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