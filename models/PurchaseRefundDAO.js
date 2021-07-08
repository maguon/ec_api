const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PurchaseRefundDAO.js');

class PurchaseRefundDAO  {
    static async queryPurchaseRefund(params) {
        let query = "select pr.* , ui.real_name , si.supplier_name" +
            " from purchase_refund pr " +
            " left join user_info ui on ui.id = pr.op_user " +
            " left join supplier_info si on si.id = pr.supplier_id " +
            " where pr.id is not null ";
        let filterObj = {};
        if(params.purchaseRefundId){
            query += " and pr.id = ${purchaseRefundId} ";
            filterObj.purchaseRefundId = params.purchaseRefundId;
        }
        if(params.status){
            query += " and pr.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.supplierId){
            query += " and pr.supplier_id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.purchaseId){
            query += " and pr.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and pr.purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.productId){
            query += " and pr.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.storageType){
            query += " and pr.storage_type = ${storageType} ";
            filterObj.storageType = params.storageType;
        }
        if(params.storageRelId){
            query += " and pr.storage_rel_id = ${storageRelId} ";
            filterObj.storageRelId = params.storageRelId;
        }
        if(params.paymentStatus){
            query += " and pr.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.dateIdStart){
            query += " and pr.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and pr.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.refundStorageFlag){
            if(params.refundStorageFlag == 1){
                query += " and pr.storage_rel_id is null ";
                filterObj.refundStorageFlag = params.refundStorageFlag;
            }
            if(params.refundStorageFlag == 2){
                query += " and pr.storage_rel_id is not null ";
                filterObj.refundStorageFlag = params.refundStorageFlag;
            }
        }
        if(params.storageType){
            query += " and pr.storage_type = ${storageType} ";
            filterObj.storageType = params.storageType;
        }
        if(params.transferCostType){
            query += " and pr.transfer_cost_type = ${transferCostType} ";
            filterObj.transferCostType = params.transferCostType;
        }
        query = query + '  order by pr.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryPurchaseRefund ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPurchaseRefundCount(params) {
        let query = "select count(id) from purchase_refund where id is not null ";
        let filterObj = {};
        if(params.purchaseRefundId){
            query += " and id = ${purchaseRefundId} ";
            filterObj.purchaseRefundId = params.purchaseRefundId;
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
        if(params.purchaseItemId){
            query += " and purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.productId){
            query += " and product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.storageType){
            query += " and storage_type = ${storageType} ";
            filterObj.storageType = params.storageType;
        }
        if(params.storageRelId){
            query += " and storage_rel_id = ${storageRelId} ";
            filterObj.storageRelId = params.storageRelId;
        }
        if(params.paymentStatus){
            query += " and payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.dateIdStart){
            query += " and date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        logger.debug(' queryPurchaseRefundCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addPurchaseRefund(params) {
        const query = 'INSERT INTO purchase_refund (status , op_user , remark , supplier_id , purchase_id , ' +
            ' purchase_item_id , product_id , product_name , storage_type , storage_rel_id , payment_status , ' +
            ' refund_unit_cost , refund_count , transfer_cost_type , transfer_cost , total_cost , refund_profile , order_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${supplierId} , ${purchaseId} , ${purchaseItemId} ,' +
            ' ${productId} , ${productName} , ${storageType} , ${storageRelId} , ${paymentStatus} ,' +
            ' ${refundUnitCost} , ${refundCount} , ${transferCostType} , ${transferCost} , ${totalCost} , ${refundProfile} , ${orderId}' +
            ' ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.supplierId = params.supplierId;
        valueObj.purchaseId = params.purchaseId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.productId = params.productId;
        valueObj.productName = params.productName;
        valueObj.storageType = params.storageType;
        valueObj.storageRelId = params.storageRelId;
        valueObj.paymentStatus = params.paymentStatus;
        valueObj.refundUnitCost = params.refundUnitCost;
        valueObj.refundCount = params.refundCount;
        valueObj.transferCostType = params.transferCostType;
        valueObj.transferCost = params.transferCost;
        valueObj.totalCost = params.totalCost;
        valueObj.refundProfile = params.refundProfile;
        valueObj.orderId = params.orderId;
        logger.debug(' addPurchaseRefund ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePurchaseRefund(params){
        const query = 'update purchase_refund set op_user=${opUser} , remark=${remark} , ' +
            ' storage_type=${storageType} , refund_unit_cost = ${refundUnitCost} , refund_count = ${refundCount} , ' +
            ' transfer_cost_type =${transferCostType} , transfer_cost = ${transferCost} , ' +
            ' total_cost = ${totalCost} , refund_profile = ${refundProfile}' +
            ' where id =${purchaseRefundId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageType =params.storageType;
        valueObj.refundUnitCost =params.refundUnitCost;
        valueObj.refundCount =params.refundCount;
        valueObj.transferCostType = params.transferCostType;
        valueObj.transferCost = params.transferCost;
        valueObj.totalCost = params.totalCost;
        valueObj.refundProfile = params.refundProfile;
        valueObj.purchaseRefundId =params.purchaseRefundId;
        logger.debug(' updatePurchaseRefund ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageRelId(params){
        const query = 'update purchase_refund set op_user=${opUser} , storage_rel_id = ${storageRelId} ' +
            ' where id =${purchaseRefundId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.storageRelId = params.storageRelId;
        valueObj.purchaseRefundId =params.purchaseRefundId;
        logger.debug(' updateStorageRelId ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePaymentStatus(params){
        const query = 'update purchase_refund set payment_status=${paymentStatus} , date_id=${dateId} ,' +
            ' op_user=${opUser} ' +
            ' where id=${purchaseRefundId} RETURNING id ';
        let valueObj = {};
        valueObj.paymentStatus = params.paymentStatus;
        valueObj.dateId = params.dateId;
        valueObj.opUser = params.opUser;
        valueObj.purchaseRefundId = params.purchaseRefundId;
        logger.debug(' updatePaymentStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update purchase_refund set status=${status} , op_user=${opUser} ' +
            ' where id=${purchaseRefundId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.purchaseRefundId = params.purchaseRefundId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = PurchaseRefundDAO;