const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PurchaseDAO.js');

class PurchaseDAO  {
    static async queryPurchase(params) {
        let query = "select pi.* , ui.real_name " +
            " from purchase_info pi " +
            " left join user_info ui on ui.id = pi.op_user " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.purchaseId){
            query += " and pi.id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.supplierId){
            query += " and pi.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.planDateStart){
            query += " and pi.plan_date_id >= ${planDateStart} ";
            filterObj.planDateStart = params.planDateStart;
        }
        if(params.planDateEnd){
            query += " and pi.plan_date_id <= ${planDateEnd} ";
            filterObj.planDateEnd = params.planDateEnd;
        }
        if(params.finishDateStart){
            query += " and pi.finish_date_id >= ${finishDateStart} ";
            filterObj.finishDateStart = params.finishDateStart;
        }
        if(params.finishDateEnd){
            query += " and pi.finish_date_id <= ${finishDateEnd} ";
            filterObj.finishDateEnd = params.finishDateEnd;
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and pi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.paymentDateStart){
            query += " and pi.payment_date_id >= ${paymentDateStart} ";
            filterObj.paymentDateStart = params.paymentDateStart;
        }
        if(params.paymentDateEnd){
            query += " and pi.payment_date_id <= ${paymentDateEnd} ";
            filterObj.paymentDateEnd = params.paymentDateEnd;
        }
        if(params.orderId){
            query += " and pi.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
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
        logger.debug(' queryPurchase ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPurchaseCount(params) {
        let query = "select count(id) from purchase_info where id is not null ";
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
        if(params.planDateId){
            query += " and plan_date_id = ${planDateId} ";
            filterObj.planDateId = params.planDateId;
        }
        if(params.finishDateId){
            query += " and finish_date_id = ${finishDateId} ";
            filterObj.finishDateId = params.finishDateId;
        }
        if(params.storageStatus){
            query += " and storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.paymentDateId){
            query += " and payment_date_id = ${paymentDateId} ";
            filterObj.paymentDateId = params.paymentDateId;
        }
        if(params.orderId){
            query += " and order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        logger.debug(' queryPurchaseCount ');
        return await pgDb.one(query,filterObj);
    }

    static async queryPurchaseAndItem(params) {
        let query = "select pi.* , ui.real_name , pit.id as item_id, pit.product_id, pit.product_name, " +
            " pit.unit_cost, pit.purchase_count, pit.total_cost, pit.status as item_status  " +
            " from purchase_info pi " +
            " left join user_info ui on ui.id = pi.op_user " +
            " left join purchase_item pit on pit.purchase_id = pi.id  " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.purchaseId){
            query += " and pi.id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and pit.id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.itemStatus){
            query += " and pit.status = ${itemStatus} ";
            filterObj.itemStatus = params.itemStatus;
        }
        if(params.supplierId){
            query += " and pi.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.productId){
            query += " and pit.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.planDateStart){
            query += " and pi.plan_date_id >= ${planDateStart} ";
            filterObj.planDateStart = params.planDateStart;
        }
        if(params.planDateEnd){
            query += " and pi.plan_date_id <= ${planDateEnd} ";
            filterObj.planDateEnd = params.planDateEnd;
        }
        if(params.finishDateStart){
            query += " and pi.finish_date_id >= ${finishDateStart} ";
            filterObj.finishDateStart = params.finishDateStart;
        }
        if(params.finishDateEnd){
            query += " and pi.finish_date_id <= ${finishDateEnd} ";
            filterObj.finishDateEnd = params.finishDateEnd;
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and pi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.paymentDateStart){
            query += " and pi.payment_date_id >= ${paymentDateStart} ";
            filterObj.paymentDateStart = params.paymentDateStart;
        }
        if(params.paymentDateEnd){
            query += " and pi.payment_date_id <= ${paymentDateEnd} ";
            filterObj.paymentDateEnd = params.paymentDateEnd;
        }
        if(params.orderId){
            query += " and pi.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
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
        logger.debug(' queryPurchaseAndItem ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPurchaseAndItemCount(params) {
        let query = "select count(id) from purchase_info where id is not null ";
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
        if(params.planDateId){
            query += " and plan_date_id = ${planDateId} ";
            filterObj.planDateId = params.planDateId;
        }
        if(params.finishDateId){
            query += " and finish_date_id = ${finishDateId} ";
            filterObj.finishDateId = params.finishDateId;
        }
        if(params.storageStatus){
            query += " and storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.paymentDateId){
            query += " and payment_date_id = ${paymentDateId} ";
            filterObj.paymentDateId = params.paymentDateId;
        }
        if(params.orderId){
            query += " and order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        logger.debug(' queryPurchaseAndItemCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addPurchase(params) {
        const query = 'INSERT INTO purchase_info (status , op_user , remark , supplier_id , supplier_name , ' +
            ' plan_date_id , finish_date_id , storage_status , payment_status , payment_date_id , transfer_cost_type , transfer_cost , ' +
            ' order_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${supplierId} , ${supplierName} , ${planDateId} ,' +
            ' ${finishDateId} , ${storageStatus} , ${paymentStatus} , ${paymentDateId} , ${transferCostType} , ${transferCost} ,' +
            ' ${orderId} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.supplierId = params.supplierId;
        valueObj.supplierName = params.supplierName;
        valueObj.planDateId = params.planDateId;
        valueObj.productAddress = params.productAddress;
        valueObj.finishDateId = params.finishDateId;
        valueObj.storageStatus = params.storageStatus;
        valueObj.paymentStatus = params.paymentStatus;
        valueObj.paymentDateId = params.paymentDateId;
        valueObj.transferCostType = params.transferCostType;
        valueObj.transferCost = params.transferCost;
        valueObj.orderId = params.orderId;
        logger.debug(' addPurchase ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePurchase(params){
        const query = 'update purchase_info set op_user=${opUser} , remark=${remark} , ' +
            ' transfer_cost_type=${transferCostType} , transfer_cost=${transferCost} , total_cost = product_cost + ${transferCost}' +
            ' where id =${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.transferCostType =params.transferCostType;
        valueObj.transferCost =params.transferCost;
        valueObj.transferCost =params.transferCost;
        valueObj.purchaseId =params.purchaseId;
        logger.debug(' updatePurchase ');
        return await pgDb.any(query,valueObj);
    }

    //根据Item 重新计算总成本，商品成本
    static async updateTotalCost(params){
        const query = ' UPDATE purchase_info ' +
            ' SET product_cost = s_pit.s_total_cost, total_cost = s_pit.s_total_cost + pi.transfer_cost ' +
            ' from purchase_info pi ' +
            ' left join ( ' +
            ' select pit.purchase_id , sum(pit.total_cost) as s_total_cost ' +
            ' from purchase_item pit ' +
            ' where pit.purchase_id= ${purchaseId}' +
            ' GROUP BY pit.purchase_id  ' +
            ' )s_pit on pi.id = s_pit.purchase_id ' +
            'where s_pit.s_total_cost is not null and purchase_info.id= ${purchaseId} ';
        let valueObj = {};
        valueObj.purchaseId =params.purchaseId;
        valueObj.purchaseId =params.purchaseId;
        logger.debug(' updateTotalCost ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageStatus(params){
        const query = 'update purchase_info set storage_status=${storageStatus} , op_user=${opUser} ' +
            ' where id=${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.storageStatus = params.storageStatus;
        valueObj.opUser = params.opUser;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' updateStorageStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePaymentStatus(params){
        const query = 'update purchase_info set payment_status=${paymentStatus} , payment_date_id=${paymentDateId} ,' +
            ' op_user=${opUser} ' +
            ' where id=${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.paymentStatus = params.paymentStatus;
        valueObj.paymentDateId = params.paymentDateId;
        valueObj.opUser = params.opUser;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' updateStorageStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update purchase_info set status=${status} , op_user=${opUser} ' +
            ' where id=${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updateFinishDateId(params){
        const query = 'update purchase_info set finish_date_id=${finishDateId} ' +
            ' where id=${purchaseId} RETURNING id ';
        let valueObj = {};
        valueObj.finishDateId = params.finishDateId;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' updateFinishDateId ');
        return await pgDb.any(query,valueObj);
    }

    static async queryStatistics(params) {
        let query = "select COALESCE(sum(transfer_cost),0) as transfer_cost, COALESCE(sum(product_cost),0) as product ," +
            " COALESCE(sum(total_cost),0) as total_cost , count(*)" +
            " from purchase_info pi " +
            " where pi.id is not null";
        let filterObj = {};
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.supplierId){
            query += " and pi.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.planDateStart){
            query += " and pi.plan_date_id >= ${planDateStart} ";
            filterObj.planDateStart = params.planDateStart;
        }
        if(params.planDateEnd){
            query += " and pi.plan_date_id <= ${planDateEnd} ";
            filterObj.planDateEnd = params.planDateEnd;
        }
        if(params.finishDateStart){
            query += " and pi.finish_date_id >= ${finishDateStart} ";
            filterObj.finishDateStart = params.finishDateStart;
        }
        if(params.finishDateEnd){
            query += " and pi.finish_date_id <= ${finishDateEnd} ";
            filterObj.finishDateEnd = params.finishDateEnd;
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and pi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.paymentDateStart){
            query += " and pi.payment_date_id >= ${paymentDateStart} ";
            filterObj.paymentDateStart = params.paymentDateStart;
        }
        if(params.paymentDateEnd){
            query += " and pi.payment_date_id <= ${paymentDateEnd} ";
            filterObj.paymentDateEnd = params.paymentDateEnd;
        }
        if(params.orderId){
            query += " and pi.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        logger.debug(' queryStatistics ');
        return await pgDb.any(query,filterObj);
    }

}

module.exports = PurchaseDAO;