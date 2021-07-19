const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PurchaseItemDAO.js');

class PurchaseItemDAO  {
    static async queryPurchaseItem(params) {
        let query = "select pit.* , ui.real_name , si.supplier_name  " +
            " from purchase_item pit " +
            " left join user_info ui on ui.id = pit.op_user " +
            " left join supplier_info si on si.id = pit.supplier_id " +
            " where pit.id is not null ";
        let filterObj = {};
        if(params.purchaseItemId){
            query += " and pit.id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.status){
            query += " and pit.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.storageStatus){
            query += " and pit.storage_tatus = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.supplierId){
            query += " and pit.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.purchaseId){
            query += " and pit.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.productId){
            query += " and pit.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        query = query + '  order by pit.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryPurchaseItem ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPurchaseItemCount(params) {
        let query = "select count(id) from purchase_item where id is not null ";
        let filterObj = {};
        if(params.purchaseItemId){
            query += " and id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.supplierId){
            query += " and supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.purchaseId){
            query += " and purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.productId){
            query += " and product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        logger.debug(' queryPurchaseItemCount ');
        return await pgDb.one(query,filterObj);
    }

    static async queryPurchaseItemStorage(params) {
        let query = "select pi.id as purchase_item_id, spr.id as storage_product_id , pi.purchase_id , pi.product_id , pi.product_name , " +
            " spr.storage_id, si.storage_name ,spr.storage_area_id , sai.storage_area_name ,  pi.supplier_id, sui.supplier_name , spr.storage_count ," +
            " pi.unit_cost , pi.purchase_count , pi.storage_status , pi.op_user ,  ui.real_name " +
            " from purchase_item pi " +
            " left join storage_product_rel spr on spr.purchase_item_id = pi.id" +
            " left join storage_info si on si.id = spr.storage_id" +
            " left join storage_area_info sai on sai.id = spr.storage_area_id " +
            " left join supplier_info sui on sui.id = pi.supplier_id " +
            " left join user_info ui on ui.id = pi.op_user " +
            " where pi.id is not null " ;
        let filterObj = {};
        if(params.purchaseId){
            query += " and pi.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.supplierId){
            query += " and pi.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.productId){
            query += " and pi.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.storageId){
            query += " and spr.storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and spr.storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        query = query + '  order by pi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryPurchaseItemStorage ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPurchaseItemStorageCount(params) {
        let query = "select count(pi.id) " +
            " from purchase_item pi " +
            " left join storage_product_rel spr on spr.purchase_item_id = pi.id" +
            " left join storage_info si on si.id = spr.storage_id" +
            " left join storage_area_info sai on sai.id = spr.storage_area_id  " +
            " left join supplier_info sui on sui.id = pi.supplier_id " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.purchaseId){
            query += " and pi.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        logger.debug(' queryPurchaseItemStorageCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addPurchaseItem(params) {
        const query = 'INSERT INTO purchase_item (status , op_user , remark , storage_status , payment_status , ' +
            ' supplier_id , purchase_id , product_id , product_name , unit_cost , purchase_count , total_cost , order_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${storageStatus} , ${paymentStatus} , ${supplierId} ,' +
            ' ${purchaseId} , ${productId} , ${productName} , ${unitCost} , ${purchaseCount} , ${totalCost} , ${orderId} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageStatus = params.storageStatus;
        valueObj.paymentStatus = params.paymentStatus;
        valueObj.supplierId = params.supplierId;
        valueObj.purchaseId = params.purchaseId;
        valueObj.productId = params.productId;
        valueObj.productName = params.productName;
        valueObj.unitCost = params.unitCost;
        valueObj.purchaseCount = params.purchaseCount;
        valueObj.totalCost = params.unitCost * params.purchaseCount;
        valueObj.orderId = params.orderId;
        logger.debug(' addPurchaseItem ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePurchaseItem(params){
        const query = 'update purchase_item set op_user=${opUser} , remark=${remark} , ' +
            ' unit_cost=${unitCost} , purchase_count=${purchaseCount} , total_cost=${totalCost}' +
            ' where id =${purchaseItemId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.unitCost =params.unitCost;
        valueObj.purchaseCount =params.purchaseCount;
        valueObj.totalCost = params.unitCost * params.purchaseCount;
        valueObj.purchaseItemId  =params.purchaseItemId ;
        logger.debug(' updatePurchaseItem ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update purchase_item set status=${status} , op_user=${opUser} ' +
            ' where id=${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageStatus(params){
        const query = 'update purchase_item set storage_status=${storageStatus} , op_user=${opUser} ' +
            ' where id=${purchaseItemId} and storage_status = 1 RETURNING id ';
        let valueObj = {};
        valueObj.storageStatus = params.storageStatus;
        valueObj.opUser = params.opUser;
        valueObj.purchaseItemId  = params.purchaseItemId ;
        logger.debug(' updateStorageStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async queryStat(params) {
        let query = "select count(*), COALESCE(sum(purchase_count),0) as purchase_count ," +
            " COALESCE(sum(total_cost),0) as total_cost " +
            " from purchase_item pi " +
            " where pi.id is not null";
        let filterObj = {};
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.supplierId){
            query += " and pi.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.purchaseId){
            query += " and pi.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.productId){
            query += " and pi.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        logger.debug(' queryStat ');
        return await pgDb.any(query,filterObj);
    }

}

module.exports = PurchaseItemDAO;