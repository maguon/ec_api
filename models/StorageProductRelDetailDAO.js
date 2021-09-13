const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const logger = serverLogger.createLogger('StorageProductRelDetailDAO.js');

class StorageProductRelDetailDAO  {
    static async queryStorageProductRelDetail(params) {
        let query = "select sprd.* , ui.real_name  , uire.real_name as apply_real_name , si.storage_name , sai.storage_area_name , sui.supplier_name , pi.product_name " +
            " from storage_product_rel_detail sprd " +
            " left join user_info ui on ui.id = sprd.op_user " +
            " left join user_info uire on uire.id = sprd.apply_user_id " +
            " left join storage_info si on si.id = sprd.storage_id " +
            " left join storage_area_info sai on sai.id = sprd.storage_area_id " +
            " left join supplier_info sui on sui.id = sprd.supplier_id " +
            " left join product_info pi on pi.id = sprd.product_id " +
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
        if(params.applyUserId){
            query += " and sprd.apply_user_id = ${applyUserId} ";
            filterObj.applyUserId = params.applyUserId;
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
        if(params.orderProdId){
            query += " and sprd.order_prod_id = ${orderProdId} ";
            filterObj.orderProdId = params.orderProdId;
        }
        if(params.orderRefundId){
            query += " and sprd.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderRefundProdId){
            query += " and sprd.order_refund_prod_id = ${orderRefundProdId} ";
            filterObj.orderRefundProdId = params.orderRefundProdId;
        }
        if(params.oldFlag){
            query += " and sprd.old_flag = ${oldFlag} ";
            filterObj.oldFlag = params.oldFlag;
        }
        if(params.prodUniqueId){
            query += " and  ${prodUniqueId} = ANY(sprd.prod_unique_arr) ";
            filterObj.prodUniqueId = params.prodUniqueId;
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
        let query = "select count(sprd.id) " +
            " from storage_product_rel_detail sprd " +
            " left join user_info ui on ui.id = sprd.op_user " +
            " left join user_info uire on uire.id = sprd.apply_user_id " +
            " left join storage_info si on si.id = sprd.storage_id " +
            " left join storage_area_info sai on sai.id = sprd.storage_area_id " +
            " left join supplier_info sui on sui.id = sprd.supplier_id " +
            " left join product_info pi on pi.id = sprd.product_id " +
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
        if(params.applyUserId){
            query += " and sprd.apply_user_id = ${applyUserId} ";
            filterObj.applyUserId = params.applyUserId;
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
        if(params.orderProdId){
            query += " and sprd.order_prod_id = ${orderProdId} ";
            filterObj.orderProdId = params.orderProdId;
        }
        if(params.orderRefundId){
            query += " and sprd.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderRefundProdId){
            query += " and sprd.order_refund_prod_id = ${orderRefundProdId} ";
            filterObj.orderRefundProdId = params.orderRefundProdId;
        }
        if(params.prodUniqueId){
            query += " and  ${prodUniqueId} = ANY(sprd.prod_unique_arr) ";
            filterObj.prodUniqueId = params.prodUniqueId;
        }
        if(params.oldFlag){
            query += " and sprd.old_flag = ${oldFlag} ";
            filterObj.oldFlag = params.oldFlag;
        }
        logger.debug(' queryStorageProductRelDetailCount ');
        return await pgDb.one(query,filterObj);
    }

    // 根据 storage_product_rel 查询结果，判断是否可以出入库，创建信息 (领料、退料、订单出库、退单入库)
    static async addStorageProductRelDetail(params) {
        let query = 'INSERT INTO storage_product_rel_detail ( op_user , remark , storage_id , storage_area_id , ' +
            ' storage_product_rel_id , supplier_id , product_id , purchase_id , purchase_item_id , storage_type , ' +
            ' storage_sub_type , storage_count , date_id , apply_user_id , old_flag , order_id , order_prod_id , ' +
            ' order_refund_id , order_refund_prod_id , prod_unique_arr , unique_flag )' +
            ' (select  ${opUser} , ${remark} , storage_id , storage_area_id , ${storageProductRelId} , ' +
            ' supplier_id , product_id , purchase_id , purchase_item_id , ${storageType} , ${storageSubType} , ' +
            ' ${storageCount} , ${dateId} , ${applyUserId} ' ;
        if(params.storageType == sysConst.storageType.import){
            query = query + ' , ${oldFlag} ' ;
        }else{
            query = query + ' , old_flag ' ;
        }

        query = query +  ' , ${orderId} , ${orderProdId} , ' +
            ' ${orderRefundId} , ${orderRefundProdId} , ${prodUniqueArr} , unique_flag ' +
            ' from storage_product_rel ' +
            ' where storage_product_rel.id= ${storageProductRelId} ' ;
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageType = params.storageType;
        valueObj.storageSubType = params.storageSubType;
        valueObj.storageCount = params.storageCount;
        valueObj.dateId = params.dateId;
        valueObj.applyUserId = params.applyUserId;
        if(params.storageType == sysConst.storageType.import){
            valueObj.oldFlag = params.oldFlag;
        }
        valueObj.orderId = params.orderId;
        valueObj.orderProdId = params.orderProdId;
        valueObj.orderRefundId = params.orderRefundId;
        valueObj.orderRefundProdId = params.orderRefundProdId;
        valueObj.prodUniqueArr = params.prodUniqueArr;

        if(params.storageType == sysConst.storageType.export){
            query = query + ' and storage_product_rel.storage_count - ${storageCount} >= 0 ';
        }
        query = query +') RETURNING id ';
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageCount = params.storageCount;
        logger.debug(' addStorageProductRelDetail ');
        return await pgDb.any(query,valueObj);
    }

    // 根据 purchase_item 查询结果，创建信息 (完成采购)
    static async addStorageProductRelDetailByPurchaseItem(params) {
        let query = 'INSERT INTO storage_product_rel_detail (op_user , storage_id , storage_area_id , ' +
            ' storage_product_rel_id , supplier_id , product_id , purchase_id , purchase_item_id , storage_type , ' +
            ' storage_sub_type , storage_count , date_id , order_id , prod_unique_arr , unique_flag ) ' +
            ' ( select ${opUser} , ${storageId} , ${storageAreaId} , ${storageProductRelId} , pit.supplier_id , pit.product_id , pit.purchase_id, ' +
            ' pit.id , ${storageType} , ${storageSubType} , ' ;
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.storageId = params.storageId;
        valueObj.storageAreaId = params.storageAreaId;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageType = params.storageType;
        valueObj.storageSubType = params.storageSubType;

        if(params.storageCount == undefined){
            query =  query + ' pit.purchase_count , ' ;
        }else{
            query =  query + ' ${storageCount} , ' ;
            valueObj.storageCount = params.storageCount;
        }

        query =  query + ' ${dateId} , pit.order_id ,array_agg(piur.unique_id) , pit.unique_flag ' +
            ' from purchase_item pit ' +
            ' left join user_info ui on ui.id = pit.op_user ' +
            ' left join supplier_info si on si.id = pit.supplier_id ' +
            ' left join purchase_item_unique_rel piur on piur.purchase_item_id = pit.id ' +
            ' where pit.id is not null  and pit.id = ${purchaseItemId} and pit.purchase_id = ${purchaseId} ' +
            ' and piur.status = 1 ' +
            ' group by pit.id order by pit.id desc ' +
            ' ) RETURNING id ';

        valueObj.dateId = params.dateId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' addStorageProductRelDetailByPurchaseItem ');
        return await pgDb.any(query,valueObj);
    }

    // 根据 storage_product_rel 查询结果，创建信息 (退货)
    static async addStorageProductRelDetailByRefund(params) {
        const query = 'INSERT INTO storage_product_rel_detail (op_user , remark , storage_id , storage_area_id , ' +
            ' storage_product_rel_id , supplier_id , product_id , purchase_id , purchase_item_id , storage_type , ' +
            ' storage_sub_type , storage_count , date_id , order_id ) ' +
            ' ( select ${opUser} , ${remark} , spr.storage_id , spr.storage_area_id , spr.id , ${supplierId} , ${productId} , ${purchaseId}, ' +
            ' ${purchaseItemId} , ${storageType} , ${storageSubType} , ${refundCount} , ${dateId} , spr.order_id ' +
            ' from storage_product_rel spr ' +
            ' where spr.id is not null  and spr.id = ${storageProductRelId} order by spr.id desc ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.supplierId = params.supplierId;
        valueObj.productId = params.productId;
        valueObj.purchaseId = params.purchaseId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.storageType = params.storageType;
        valueObj.storageSubType = params.storageSubType;
        valueObj.refundCount = params.refundCount;
        valueObj.dateId = params.dateId;
        valueObj.storageProductRelId = params.storageProductRelId;
        logger.debug(' addStorageProductRelDetailByRefund ');
        return await pgDb.any(query,valueObj);
    }

    // 根据 storage_product_rel 查询结果，创建信息 (移库)
    static async addStorageProductRelDetailByMove(params) {
        const query = 'INSERT INTO storage_product_rel_detail (op_user , remark , storage_id , storage_area_id , ' +
            ' storage_product_rel_id , supplier_id , product_id , purchase_id , purchase_item_id , storage_type , ' +
            ' storage_sub_type , storage_count , date_id , order_id ) ' +
            ' ( select ${opUser} , ${remark} , spr.storage_id , spr.storage_area_id , spr.id , spr.supplier_id , ' +
            ' spr.product_id , spr.purchase_id , spr.purchase_item_id , ${storageType} , ${storageSubType} , ' +
            ' ${moveCount} , ${dateId} , spr.order_id ' +
            ' from storage_product_rel spr ' +
            ' where spr.id is not null  and spr.id = ${storageProductRelId} order by spr.id desc ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageType = params.storageType;
        valueObj.storageSubType = params.storageSubType;
        valueObj.moveCount = params.moveCount;
        valueObj.dateId = params.dateId;
        valueObj.storageProductRelId = params.storageProductRelId;
        logger.debug(' addStorageProductRelDetailByMove ');
        return await pgDb.any(query,valueObj);
    }

    // 根据 storage_check 查询结果，创建信息 (盘库)
    static async addStorageProductRelDetailByCheck(params) {
        const query = 'INSERT INTO storage_product_rel_detail (op_user , storage_id , storage_area_id , ' +
            ' storage_product_rel_id , supplier_id , product_id , purchase_id , purchase_item_id , storage_type , ' +
            ' storage_sub_type , storage_count , date_id , order_id ) ' +
            ' ( select scr.op_user , scr.storage_id , scr.storage_area_id , ' +
            ' scr.storage_product_rel_id , spr.supplier_id , spr.product_id , spr.purchase_id , spr.purchase_item_id , ' +
            ' (case when  (scr.storage_count - scr.check_count)>0 then 2 else 1 end ) as storage_type , ' +
            ' (case when  (scr.storage_count - scr.check_count)>0 then 23 else 13 end ) as storage_sub_type , ' +
            ' abs(scr.storage_count - scr.check_count) as storage_count , ${dateId} , spr.order_id ' +
            ' from storage_check_rel scr ' +
            ' left join storage_product_rel spr on spr.id = scr.storage_product_rel_id ' +
            ' where (scr.storage_count - scr.check_count)<>0 and scr.storage_check_id = ${storageCheckId} ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.dateId = params.dateId;
        valueObj.storageCheckId =params.storageCheckId;
        logger.debug(' addStorageProductRelDetailByCheck ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = StorageProductRelDetailDAO;