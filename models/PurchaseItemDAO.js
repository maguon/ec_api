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
        if(params.purchaseId){
            query += " and id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
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

    static async addPurchaseItem(params) {
        const query = 'INSERT INTO purchase_item (status , op_user , remark , storage_status , payment_status , ' +
            ' supplier_id , purchase_id , product_id , product_name , unit_cost , purchase_count , order_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${storageStatus} , ${paymentStatus} , ${supplierId} ,' +
            ' ${purchaseId} , ${productId} , ${productName} , ${unitCost} , ${purchaseCount} , ${orderId} ) RETURNING id ';
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
        valueObj.orderId = params.orderId;
        logger.debug(' addPurchaseItem ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePurchaseItem(params){
        const query = 'update purchase_item set op_user=${opUser} , remark=${remark} , ' +
            ' unit_cost=${unitCost} , purchase_count=${purchaseCount} ' +
            ' where id =${purchaseItemId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.unitCost =params.unitCost;
        valueObj.purchaseCount =params.purchaseCount;
        valueObj.purchaseItemId  =params.purchaseItemId ;
        logger.debug(' updatePurchaseItem ');
        return await pgDb.any(query,valueObj);
    }

    //全表重新计算总成本
    static async updateItemTotalCost(params){
        const query = ' update purchase_item set total_cost = unit_cost * purchase_count ' +
            ' where purchase_id=${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.purchaseId =params.purchaseId;
        logger.debug(' updateItemTotalCost ');
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

}

module.exports = PurchaseItemDAO;