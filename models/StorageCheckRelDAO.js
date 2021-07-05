const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageCheckRelDAO.js');

class StorageCheckRelDAO  {
    static async queryStorageCheckRel(params) {
        let query = "select sc.* ,ui.real_name from storage_check_rel sc " +
            " left join user_info ui on ui.id = sc.op_user " +
            " where sc.id is not null ";
        let filterObj = {};
        if(params.storageCheckRelId){
            query += " and sc.id = ${storageCheckRelId} ";
            filterObj.storageCheckRelId = params.storageCheckRelId;
        }
        if(params.storageCheckId){
            query += " and sc.storage_check_id = ${storageCheckId} ";
            filterObj.storageCheckId = params.storageCheckId;
        }
        if(params.storageId){
            query += " and sc.storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and sc.storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.productId){
            query += " and sc.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.status){
            query += " and sc.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.checkStatus){
            query += " and sc.check_status = ${checkStatus} ";
            filterObj.checkStatus = params.checkStatus;
        }
        if(params.dateIdStart){
            query += " and sc.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and sc.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        query = query + '  order by sc.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryStorageCheckRel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageCheckRelCount(params) {
        let query = "select count(id) from storage_check_rel where id is not null ";
        let filterObj = {};
        if(params.storageCheckRelId){
            query += " and id = ${storageCheckRelId} ";
            filterObj.storageCheckRelId = params.storageCheckRelId;
        }
        if(params.storageCheckId){
            query += " and storage_check_id = ${storageCheckId} ";
            filterObj.storageCheckId = params.storageCheckId;
        }
        if(params.storageId){
            query += " and storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.productId){
            query += " and product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.checkStatus){
            query += " and check_status = ${checkStatus} ";
            filterObj.checkStatus = params.checkStatus;
        }
        if(params.dateIdStart){
            query += " and date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        logger.debug(' queryStorageRelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageCheckRel(params) {
        let query = 'INSERT INTO storage_check_rel (op_user , ' +
            ' remark , storage_check_id , date_id , storage_count , storage_product_rel_id ,' +
            ' storage_id , storage_area_id , product_id ) ' +
            ' (select ${opUser} , ${remark} , ${storageCheckId} , ${dateId} , ' +
            ' spr.storage_count , spr.id , spr.storage_id , spr.storage_area_id , spr.product_id ' +
            ' from storage_product_rel spr ' +
            ' where spr.id is not null ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.checkStatus = params.checkStatus;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageCheckId = params.storageCheckId;
        valueObj.dateId = params.dateId;

        if(params.storageId){
            query += " and spr.storage_id = ${storageId} ";
            valueObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and storage_area_id = ${storageAreaId} ";
            valueObj.storageAreaId = params.storageAreaId;
        }
        if(params.supplierId){
            query += " and supplier_id = ${supplierId} ";
            valueObj.supplierId = params.supplierId;
        }
        if(params.productId){
            query += " and spr.product_id = ${productId} ";
            valueObj.productId = params.productId;
        }
        if(params.productName){
            query += " and spr.product_name = ${productName} ";
            valueObj.productName = params.productName;
        }
        if(params.purchaseId){
            query += " and spr.purchase_id = ${purchaseId} ";
            valueObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and spr.purchase_item_id = ${purchaseItemId} ";
            valueObj.purchaseItemId = params.purchaseItemId;
        }
        query += ") RETURNING id ";
        logger.debug(' addStorageCheckRel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageCheckRel(params){
        const query = 'update storage_check_rel set op_user=${opUser} , remark=${remark} , ' +
            ' check_count=${checkCount} , status = ${status} ,  ' +
            ' check_status = (' +
            ' select (case when scr.storage_count=${checkCount} then 1 else 2 end ) as check_status ' +
            ' from storage_check_rel scr ' +
            ' where id = ${storageCheckRelId} )' +
            ' where id =${storageCheckRelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.checkCount = params.checkCount;
        valueObj.status = 2;
        valueObj.checkCount = params.checkCount;
        valueObj.storageCheckRelId =params.storageCheckRelId;
        valueObj.storageCheckRelId =params.storageCheckRelId;
        logger.debug(' updateStorageCheckRel ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = StorageCheckRelDAO;