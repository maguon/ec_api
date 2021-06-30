const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageProductRelDAO.js');

class StorageProductRelDAO  {
    static async queryStorageProductRel(params) {
        let query = "select spr.* ,ui.real_name from storage_product_rel spr " +
            " left join user_info ui on ui.id = spr.op_user " +
            " where spr.id is not null ";
        let filterObj = {};
        if(params.storageProductRelId){
            query += " and spr.id = ${storageProductRelId} ";
            filterObj.storageProductRelId = params.storageProductRelId;
        }
        if(params.status){
            query += " and spr.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and spr.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.storageId){
            query += " and spr.storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and spr.storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.supplierId){
            query += " and spr.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.productId){
            query += " and spr.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.purchaseId){
            query += " and spr.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and spr.purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.dateId){
            query += " and spr.date_id = ${dateId} ";
            filterObj.dateId = params.dateId;
        }
        if(params.orderId){
            query += " and spr.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        query = query + '  order by spr.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryStorageProductRel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageProductRelCount(params) {
        let query = "select count(id) from storage_product_rel where id is not null ";
        let filterObj = {};
        if(params.storageProductRelId){
            query += " and id = ${storageProductRelId} ";
            filterObj.storageProductRelId = params.storageProductRelId;
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
        if(params.dateId){
            query += " and date_id = ${dateId} ";
            filterObj.dateId = params.dateId;
        }
        if(params.orderId){
            query += " and order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        logger.debug(' queryStorageProductRelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageProductRel(params) {
        const query = 'INSERT INTO storage_product_rel (status , op_user , remark , storage_id , storage_area_id , ' +
            ' supplier_id , product_id , product_name , purchase_id , purchase_item_id , unit_cost , storage_count , ' +
            ' date_id , order_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${storageId} , ${storageAreaId} , ${supplierId} , ' +
            ' ${productId} , ${productName} ,${purchaseId} , ${purchaseItemId} , ${unitCost} , ${storageCount} , ' +
            ' ${dateId} , ${orderId}) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageId = params.storageId;
        valueObj.storageAreaId = params.storageAreaId;
        valueObj.supplierId = params.supplierId;
        valueObj.productId = params.productId;
        valueObj.productName = params.productName;
        valueObj.purchaseId = params.purchaseId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.unitCost = params.unitCost;
        valueObj.storageCount = params.storageCount;
        valueObj.dateId = params.dateId;
        valueObj.orderId = params.orderId;
        logger.debug(' addStorageProductRel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageProductRel(params){
        const query = 'update storage_product_rel set op_user=${opUser} , remark=${remark} ' +
            ' where id =${storageProductRelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageProductRelId =params.storageProductRelId;
        logger.debug(' updateStorageProductRel ');
        return await pgDb.any(query,valueObj);
    }

    //更新库存数量
    static async updateStorageCount(params){
        const query = 'update storage_product_rel set op_user=${opUser} , storage_count = storage_count + ${storageCount}  ' +
            ' where id =${storageProductRelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.storageCount = params.storageCount;
        valueObj.storageProductRelId =params.storageProductRelId;
        logger.debug(' updateStorageProductRel ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = StorageProductRelDAO;