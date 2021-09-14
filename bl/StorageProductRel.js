
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
        params.orderId = null;
        params.orderProdId = null;
        params.orderRefundId = null;
        params.orderRefundProdId = null;

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

const updateStorageMove = async (req,res,next)=>{
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

    try{
        //update storage_count and prodUniqueArr
        const rowsReturn = await updateStorageProdRelCount(path.storageProductRelId,sysConst.storageType.export,
            params.moveCount,(params.prodUniqueArr?params.prodUniqueArr:null));
        logger.info(' updateStorageMove updateStorageProdRelCount ' + 'success');

        if( rowsReturn.success ){
            //add detail info
            params.storageType = sysConst.storageType.export;
            params.storageSubType = sysConst.storageExportType.storageMoveExport;
            const rowsAddExportDetail = await storageProductRelDetailDAO.addStorageProductRelDetailByMove(params);
            logger.info(' updateStorageMove addStorageProductRelDetailByMove ' + 'success');

            //add rel info
            const rowsAddRel = await storageProductRelDAO.addStorageProductRelByMove(params);
            logger.info(' updateStorageMove addStorageProductRelByMove ' + 'success');

            //add new detail info
            params.storageType = sysConst.storageType.import;
            params.storageSubType = sysConst.storageImportType.storageMoveImport;
            params.storageProductRelId = rowsAddRel[0].id;
            //创建 storage_product_detail 入库
            const rowsAddImportDetail = await storageProductRelDetailDAO.addStorageProductRelDetailByMove(params);
            logger.info(' updateStorageMove addStorageProductRelDetailByMove ' + 'success');

        }else{
            resUtil.resetFailedRes(res,{message:'移库失败！'});
            return next();
        }

        resUtil.resetUpdateRes(res,{id:path.storageProductRelId});
        return next();
    }catch (e) {
        logger.error(" updateStorageMove error ",e.stack);
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

//更新商品库存 和 商品唯一码
const  updateStorageProdRelCount = async (storageProductRelId,addFlag,count,uniqueArray) =>{
    try {
        const originStorageProdRel = await storageProductRelDAO.queryStorageProductRel({storageProductRelId:storageProductRelId});
        if(originStorageProdRel && originStorageProdRel.length==1){
            let newCount ;
            let newUniqueArray ;
            if(originStorageProdRel[0].unique_flag ==1){
                //有商品标记
                if(sysConst.storageType.import == addFlag){
                    //入库
                    newCount = originStorageProdRel[0].storage_count + count;
                    if(originStorageProdRel[0].prod_unique_arr == null || originStorageProdRel[0].prod_unique_arr ==[null]){
                        newUniqueArray = uniqueArray;
                    }else{
                        newUniqueArray = originStorageProdRel[0].prod_unique_arr.concat(uniqueArray);
                    }

                }else{
                    //出库
                    newCount = originStorageProdRel[0].storage_count - count;
                    if(newCount<0 || originStorageProdRel[0].prod_unique_arr == null ||originStorageProdRel[0].prod_unique_arr ==[null]
                        ||originStorageProdRel[0].prod_unique_arr.length<uniqueArray.length){
                        //无法更新 无法出库
                        return {success:false};
                    }else{
                        //整理出库后的商品码
                        newUniqueArray = originStorageProdRel[0].prod_unique_arr;
                        for(let i=0;i<uniqueArray.length;i++){
                            let removeFlag = false;
                            for(let j=0;j<newUniqueArray.length;j++){
                                if(newUniqueArray[j] == uniqueArray[i]){
                                    //匹配到商品码，移除商品码
                                    newUniqueArray.splice(j,1);
                                    removeFlag = true;
                                }
                            }
                            if(!removeFlag){
                                //未找到匹配的商品码
                                newCount += 1;
                            }
                        }
                        // return true;
                    }
                }
                //update count & unique array
                const rowsUpdateUniqueArr = await storageProductRelDAO.updateStorageCountAndUniqueArr({
                    storageCount:newCount,prodUniqueArr: newUniqueArray,storageProductRelId:storageProductRelId});
                if(rowsUpdateUniqueArr.length>0){
                    return {success:true,newUniqueArray};
                }else{
                    return {success:false};
                }

            }else{
                // update count
                if(sysConst.storageType.import == addFlag){
                    //入库
                    newCount = originStorageProdRel[0].storage_count + count;

                }else{
                    //出库
                    newCount = originStorageProdRel[0].storage_count - count;
                    if(newCount<0){
                        //无法更新 无法出库
                        return {success:false};
                    }
                }
                const rowsUpdateCount = await storageProductRelDAO.updateCount({storageCount:newCount,storageProductRelId:storageProductRelId});
                if(rowsUpdateCount.length>0){
                    return {success:true,count};
                }else{
                    return {success:false};
                }

            }
        }else{
            //找不到库存记录
            return {success:false};
        }
    }catch (e) {
        logger.error(" addRelDetailImport error ",e.stack);
        return {success:false};
    }

};


module.exports = {
    queryStorageProductRel,
    queryStorageProductRelCsv,
    addStorageProductRel,
    updateStorageProductRel,
    updateStorageMove,
    queryStat,
    updateStorageProdRelCount
}