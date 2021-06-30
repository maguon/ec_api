const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageProductRelDetailDAO.js');

class StorageProductRelDetailDAO  {
    static async queryStorageProductRelDetail(params) {
        let query = "select sprd.* ,ui.real_name from storage_product_rel_detail sprd " +
            " left join user_info ui on ui.id = sprd.op_user " +
            " where sprd.id is not null ";
        let filterObj = {};
        if(params.storageProductRelDetailId){
            query += " and sprd.id = ${storageProductRelDetailId} ";
            filterObj.storageProductRelDetailId = params.storageProductRelDetailId;
        }
        if(params.status){
            query += " and sprd.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and sprd.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.storageId){
            query += " and sprd.storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and sprd.storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.storageProductRelId){
            query += " and sprd.storage_product_rel_id = ${storageProductRelId} ";
            filterObj.storageProductRelId = params.storageProductRelId;
        }
        if(params.supplierId){
            query += " and sprd.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.productId){
            query += " and sprd.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.purchaseId){
            query += " and sprd.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and sprd.purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.storageType){
            query += " and sprd.storage_type = ${storageType} ";
            filterObj.storageType = params.storageType;
        }
        if(params.storageSubType){
            query += " and sprd.storage_sub_type = ${storageSubType} ";
            filterObj.storageSubType = params.storageSubType;
        }
        if(params.dateIdStart){
            query += " and sprd.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and sprd.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }

        if(params.orderId){
            query += " and sprd.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        query = query + '  order by sprd.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryStorageProductRelDetail ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageProductRelDetailCount(params) {
        let query = "select count(id) from storage_product_rel_detail where id is not null ";
        let filterObj = {};
        if(params.storageProductRelDetailId){
            query += " and id = ${storageProductRelDetailId} ";
            filterObj.storageProductRelDetailId = params.storageProductRelDetailId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.storageId){
            query += " and storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.storageProductRelId){
            query += " and storage_product_rel_id = ${storageProductRelId} ";
            filterObj.storageProductRelId = params.storageProductRelId;
        }
        if(params.supplierId){
            query += " and supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.productId){
            query += " and product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.purchaseId){
            query += " and purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.dateIdStart){
            query += " and date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.orderId){
            query += " and order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        logger.debug(' queryStorageProductRelDetailCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageProductRelDetail(params) {
        const query = 'INSERT INTO storage_product_rel_detail (status , op_user , remark , storage_id , storage_area_id , ' +
            ' storage_product_rel_id , supplier_id , product_id , purchase_id , purchase_item_id , storage_type , ' +
            ' storage_sub_type , storage_count , date_id , order_id ) ' +
            ' select ${status} , ${opUser} , ${remark} , storage_id , storage_area_id , ${storageProductRelId} , ' +
            ' supplier_id , product_id , purchase_id , purchase_item_id , ${storageType} , ${storageSubType} , ' +
            ' ${storageCount} , ${dateId} ,order_id ' +
            ' from storage_product_rel ' +
            ' where storage_product_rel.id= ${storageProductRelId} and storage_product_rel.storage_count - ${storageCount} >= 0 ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageType = params.storageType;
        valueObj.storageSubType = params.storageSubType;
        valueObj.storageCount = params.storageCount;
        valueObj.dateId = params.dateId;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageCount = params.storageCount;
        logger.debug(' addStorageProductRelDetail ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = StorageProductRelDetailDAO;