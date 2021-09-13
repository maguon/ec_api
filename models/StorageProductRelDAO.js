const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageProductRelDAO.js');

class StorageProductRelDAO  {
    static async queryStorageProductRel(params) {
        let query = "select spr.* , ui.real_name , si.storage_name , sai.storage_area_name , sui.supplier_name " +
            " from storage_product_rel spr " +
            " left join user_info ui on ui.id = spr.op_user " +
            " left join storage_info si on si.id = spr.storage_id " +
            " left join storage_area_info sai on sai.id = spr.storage_area_id " +
            " left join supplier_info sui on sui.id = spr.supplier_id " +
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
        if(params.dateIdStart){
            query += " and spr.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and spr.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.orderId){
            query += " and spr.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.oldFlag){
            query += " and spr.old_flag = ${oldFlag} ";
            filterObj.oldFlag = params.oldFlag;
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
        logger.debug(' queryStorageProductRelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageProductRel(params) {
        const query = 'INSERT INTO storage_product_rel ( op_user , remark , storage_id , storage_area_id , ' +
            ' supplier_id , product_id , product_name , purchase_id , purchase_item_id , unit_cost , storage_count , ' +
            ' date_id , order_id , old_flag , prod_unique_arr , unique_flag ) ' +
            ' VALUES ( ${opUser} , ${remark} , ${storageId} , ${storageAreaId} , ${supplierId} , ' +
            ' ${productId} , ${productName} ,${purchaseId} , ${purchaseItemId} , ${unitCost} , ${storageCount} , ' +
            ' ${dateId} , ${orderId} , ${oldFlag} , ${prodUniqueArr} , ${uniqueFlag} ) RETURNING id ';
        let valueObj = {};
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
        if(params.oldFlag){
            valueObj.oldFlag = params.oldFlag;
        }else{
            valueObj.oldFlag = 0;
        }
        valueObj.prodUniqueArr = params.prodUniqueArr;
        valueObj.uniqueFlag = params.uniqueFlag;
        logger.debug(' addStorageProductRel ');
        return await pgDb.any(query,valueObj);
    }

    //  根据 purchase_item 查询结果，创建信息
    static async addStorageProductRelByPurchaseItem(params) {
        let query = 'INSERT INTO storage_product_rel ( op_user , remark , storage_id , storage_area_id , ' +
            ' supplier_id , product_id , product_name , purchase_id , purchase_item_id , unit_cost , storage_count , ' +
            ' date_id , order_id , prod_unique_arr , unique_flag ) ' +
            ' ( select  ${opUser} , ${remark} , ${storageId} , ${storageAreaId} , ' +
            ' pit.supplier_id, pit.product_id , pit.product_name , pit.purchase_id, ' +
            ' pit.id , pit.unit_cost , ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageId = params.storageId;
        valueObj.storageAreaId = params.storageAreaId;

        if(params.storageCount == undefined){
            query =  query + ' pit.purchase_count , ' ;
        }else{
            query =  query + ' ${storageCount} , ' ;
            valueObj.storageCount = params.storageCount;
        }

        query =  query + ' ${dateId} , pit.order_id , array_agg(piur.unique_id) , pit.unique_flag ' +
            ' from purchase_item pit ' +
            ' left join user_info ui on ui.id = pit.op_user ' +
            ' left join supplier_info si on si.id = pit.supplier_id ' +
            ' left join purchase_item_unique_rel piur on piur.purchase_item_id = pit.id ' +
            ' where pit.id is not null  and pit.id = ${purchaseItemId}  and pit.purchase_id = ${purchaseId}' +
            ' and piur.status = 1 ' +
            ' group by pit.id order by pit.id desc ) RETURNING id ';

        valueObj.dateId = params.dateId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' addStorageProductRelByPurchaseItem ');
        return await pgDb.any(query,valueObj);
    }

    //  根据  storage_product_rel 查询结果，创建信息 (移库)
    static async addStorageProductRelByMove(params) {
        const query = 'INSERT INTO storage_product_rel ( op_user , remark , storage_id , storage_area_id , ' +
            ' supplier_id , product_id , product_name , purchase_id , purchase_item_id , unit_cost , storage_count , ' +
            ' date_id , order_id , old_flag , prod_unique_arr , unique_flag ) ' +
            ' ( SELECT ${opUser} , ${remark} , ${storageId} , ${storageAreaId} , ' +
            ' sprs.supplier_id , sprs.product_id , sprs.product_name , sprs.purchase_id , ' +
            ' sprs.purchase_item_id , sprs.unit_cost , ${moveCount} , ${dateId} , sprs.order_id , sprs.old_flag , ' +
            ' ${prodUniqueArr} , ${uniqueFlag} ' +
            ' FROM storage_product_rel sprs ' +
            ' WHERE sprs.id is not null and sprs.id = ${storageProductRelId}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageId = params.moveStorageId;
        valueObj.storageAreaId = params.moveStorageAreaId;
        valueObj.moveCount = params.moveCount;
        valueObj.dateId = params.dateId;
        valueObj.prodUniqueArr = params.prodUniqueArr;
        valueObj.uniqueFlag = params.uniqueFlag;
        valueObj.storageProductRelId = params.storageProductRelId;
        logger.debug(' addStorageProductRelByMove ');
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

    //更新库存数量 加减
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

    //更新库存数量 根据盘点数量
    static async updateStorageCountByStorageCheckId(params){
        const query = ' update storage_product_rel set storage_count = check_count ' +
            ' from storage_product_rel spr ' +
            ' left join storage_check_rel scr on scr.storage_product_rel_id = spr.id ' +
            ' where (scr.storage_count - scr.check_count)<>0 and scr.storage_check_id = ${storageCheckId}' +
            ' and  storage_product_rel.id = scr.storage_product_rel_id RETURNING storage_product_rel.id ';
        let valueObj = {};
        valueObj.storageCheckId =params.storageCheckId;
        logger.debug(' updateStorageCountByStorageCheckId ');
        return await pgDb.any(query,valueObj);
    }

    //判断 退货数量 是否可以退货
    static async updateStorageCountByRefund(params){
        const query = 'update storage_product_rel ' +
            ' set storage_count =  storage_count - ${refundCount} ' +
            ' where id = ${storageProductRelId} and (storage_count - ${refundCount}) >=0 RETURNING id ';

        let valueObj = {};
        valueObj.refundCount = params.refundCount;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.refundCount = params.refundCount;
        logger.debug(' updateStorageCountByRefund ');
        return await pgDb.any(query,valueObj);
    }

    //判断 移库数量 是否可以移库
    static async updateStorageCountByMove(params){
        const query = 'update storage_product_rel ' +
            ' set storage_count =  storage_count - ${moveCount} ' +
            ' where id = ${storageProductRelId} and (storage_count - ${moveCount}) >=0 RETURNING id ';

        let valueObj = {};
        valueObj.moveCount = params.moveCount;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.refundCount = params.refundCount;
        logger.debug(' updateStorageCountByRefund ');
        return await pgDb.any(query,valueObj);
    }

    //更新 商品唯一码（订单出库,移库）
    static async updateProdUniqueArr(params){
        const query = ' UPDATE storage_product_rel ' +
            ' SET op_user = ${opUser} , prod_unique_arr = new_arr.unique_arr ' +
            ' from ( ' +
            ' select array( ' +
            ' select regexp_split_to_table(array_to_string(prod_unique_arr,\',\'),\',\') ' +
            ' from storage_product_rel where id = ${storageProductRelId} ' +
            ' except ' +
            ' select regexp_split_to_table(array_to_string(prod_unique_arr,\',\'),\',\') ' +
            ' from storage_product_rel_detail where id=${storageProductRelDetail}) as unique_arr ' +
            ' )new_arr ' +
            ' WHERE id = ${storageProductRelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageProductRelDetail = params.storageProductRelDetail;
        valueObj.storageProductRelId = params.storageProductRelId;
        logger.debug(' updateProdUniqueArr ');
        return await pgDb.any(query,valueObj);
    }

    //更新 商品唯一码（移库）
    static async updateProdUniqueArrByMove(params){
        const query = ' UPDATE storage_product_rel ' +
            ' SET op_user = ${opUser} , prod_unique_arr = new_arr.unique_arr ' +
            ' from ( ' +
            ' select array( ' +
            ' select regexp_split_to_table(array_to_string(prod_unique_arr,\',\'),\',\') ' +
            ' from storage_product_rel where id = ${storageProductRelId} ' +
            ' except ' +
            ' select regexp_split_to_table(array_to_string(prod_unique_arr,\',\'),\',\') ' +
            ' from storage_product_rel_detail where id=${storageProductRelDetail}) as unique_arr ' +
            ' )new_arr ' +
            ' WHERE id = ${storageProductRelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageProductRelDetail = params.storageProductRelDetail;
        valueObj.storageProductRelId = params.storageProductRelId;
        logger.debug(' updateProdUniqueArrByMove ');
        return await pgDb.any(query,valueObj);
    }

    static async queryStat(params) {
        let query = "select COALESCE(sum(unit_cost*storage_count),0) as total_cost, COALESCE(sum(storage_count),0) as storage_count" +
            " from storage_product_rel spr " +
            " where spr.id is not null and spr.storage_count > 0 ";
        let filterObj = {};
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
        if(params.dateIdStart){
            query += " and spr.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and spr.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.orderId){
            query += " and spr.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.status){
            query += " and spr.status = ${status} ";
            filterObj.status = params.status;
        }
        logger.debug(' queryStat ');
        return await pgDb.any(query,filterObj);
    }

}

module.exports = StorageProductRelDAO;