const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderProdServiceDAO.js');

class OrderItemProdDAO  {
    static async queryItemProd(params) {
        let query = "select oip.* , ui.real_name , " +
            "   oi.status as or_status , oi.payment_status as or_payment_status , oi.re_user_id as or_re_user_id ," +
            "   oi.re_user_name as or_re_user_name , oi.order_type as or_order_type , oi.client_id as or_client_id , " +
            "   oi.client_agent_id as or_client_agent_id , oi.client_name as or_client_name , " +
            "   oi.date_id as or_date_id , oi.fin_date_id as or_fin_date_id  " +
            "   from order_item_prod oip " +
            "   left join user_info ui on ui.id = oip.op_user " +
            "   left join order_info oi on oi.id = oip.order_id " +
            "   where oip.id is not null ";
        let filterObj = {};
        if(params.orderItemProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderItemProdId = params.orderItemProdId;
        }
        if(params.status){
            query += " and oip.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and oip.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.orderId){
            query += " and oip.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and oip.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oip.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.orderItemType){
            query += " and oip.order_item_type = ${orderItemType} ";
            filterObj.orderItemType = params.orderItemType;
        }
        if(params.prodId){
            query += " and oip.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.dateStart){
            query += " and oip.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and oip.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        query = query + '  order by OiP.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryItemProd ');
        return await pgDb.any(query,filterObj);
    }

    static async queryItemProdCount(params) {
        let query = "select count(oip.id) from order_item_prod oip where oip.id is not null ";
        let filterObj = {};
        if(params.orderItemProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderItemProdId = params.orderItemProdId;
        }
        if(params.status){
            query += " and oip.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and oip.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.orderId){
            query += " and oip.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and oip.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oip.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.orderItemType){
            query += " and oip.order_item_type = ${orderItemType} ";
            filterObj.orderItemType = params.orderItemType;
        }
        if(params.prodId){
            query += " and oip.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.dateStart){
            query += " and oip.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and oip.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        logger.debug(' queryItemProdCount ');
        return await pgDb.one(query,filterObj);
    }

    static async queryItemProdStorage(params) {
        let query = "select oip.* , ui.real_name , " +
            "   oi.status as or_status , oi.payment_status as or_payment_status , oi.re_user_id as or_re_user_id ," +
            "   oi.re_user_name as or_re_user_name , oi.order_type as or_order_type , oi.client_id as or_client_id , " +
            "   oi.client_agent_id as or_client_agent_id , oi.client_name as or_client_name , " +
            "   oi.date_id as or_date_id , oi.fin_date_id as or_fin_date_id , " +
            "   sprd.op_user as st_op_user , sprd.remark as st_remark , " +
            "   sprd.storage_id as st_storage_id , sti.storage_name as st_storage_name , " +
            "   sprd.storage_area_id as st_storage_area_id , stai.storage_area_name as st_storage_area_name , " +
            "   sprd.storage_product_rel_id as st_storage_product_rel_id , sprd.supplier_id as st_supplier_id , si.supplier_name as st_supplier_name ," +
            "   sprd.product_id as st_product_id , sprd.purchase_id as st_purchase_id , sprd.purchase_item_id as st_purchase_item_id ," +
            "   sprd.storage_type as st_storage_type , sprd.storage_sub_type as st_storage_sub_type , " +
            "   sprd.storage_count as st_storage_count , sprd.date_id as st_date_id , sprd.apply_user_id as st_apply_user_id , " +
            "   sui.real_name as st_apply_user_name " +
            "   from order_item_prod oip " +
            "   left join user_info ui on ui.id = oip.op_user " +
            "   left join order_info oi on oi.id = oip.order_id " +
            "   left join storage_product_rel_detail sprd on sprd.order_prod_id = oip.id " +
            "   left join user_info sui on sui.id = sprd.apply_user_id " +
            "   left join supplier_info si on si.id = sprd.supplier_id " +
            "   left join storage_info sti on sti.id = sprd.storage_id " +
            "   left join storage_area_info stai on stai.id = sprd.storage_area_id " +
            "   where oip.id is not null ";
        let filterObj = {};
        if(params.orderItemProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderItemProdId = params.orderItemProdId;
        }
        if(params.status){
            query += " and oip.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and oip.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.orderId){
            query += " and oip.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and oip.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oip.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.orderItemType){
            query += " and oip.order_item_type = ${orderItemType} ";
            filterObj.orderItemType = params.orderItemType;
        }
        if(params.prodId){
            query += " and oip.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.orderDateStart){
            query += " and oi.date_id >= ${orderDateStart} ";
            filterObj.orderDateStart = params.orderDateStart;
        }
        if(params.orderDateEnd){
            query += " and oi.date_id <= ${orderDateEnd} ";
            filterObj.orderDateEnd = params.orderDateEnd;
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
        if(params.purchaseId){
            query += " and sprd.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.applyUserId){
            query += " and sprd.apply_user_id = ${applyUserId} ";
            filterObj.applyUserId = params.applyUserId;
        }
        query = query + '  order by OiP.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryItemProdStorage ');
        return await pgDb.any(query,filterObj);
    }

    static async queryItemProdStorageCount(params) {
        let query = "select count(oip.id)  from order_item_prod oip " +
            "   left join user_info ui on ui.id = oip.op_user " +
            "   left join order_info oi on oi.id = oip.order_id " +
            "   left join storage_product_rel_detail sprd on sprd.order_prod_id = oip.id " +
            "   left join user_info sui on sui.id = sprd.apply_user_id " +
            "   where oip.id is not null";
        let filterObj = {};
        if(params.orderItemProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderItemProdId = params.orderItemProdId;
        }
        if(params.status){
            query += " and oip.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and oip.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.orderId){
            query += " and oip.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and oip.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oip.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.orderItemType){
            query += " and oip.order_item_type = ${orderItemType} ";
            filterObj.orderItemType = params.orderItemType;
        }
        if(params.prodId){
            query += " and oip.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.orderDateStart){
            query += " and oi.date_id >= ${orderDateStart} ";
            filterObj.orderDateStart = params.orderDateStart;
        }
        if(params.orderDateEnd){
            query += " and oi.date_id <= ${orderDateEnd} ";
            filterObj.orderDateEnd = params.orderDateEnd;
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
        if(params.purchaseId){
            query += " and sprd.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        logger.debug(' queryItemProdStorageCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addItemProd(params) {
        const query = ' INSERT INTO order_item_prod( op_user, sale_user_id, sale_user_name, remark, ' +
            ' order_id, client_id, client_agent_id, order_item_type, ' +
            ' prod_id, prod_name, unit_price, prod_count, prod_price, ' +
            ' discount_prod_price, actual_prod_price, date_id) ' +
            ' ( select ${opUser} , ${saleUserId} , ${saleUserName} , ${remark} ,${orderId} , ' +
            '   ${clientId} , ${clientAgentId} , ${orderItemType} , ' +
            '   pi.id , pi.product_name , pi.price , ' +
            '   ${prodCount} , COALESCE(pi.price,0)*${prodCount}, ' +
            '   ${discountProdPrice} , ' +
            '   COALESCE(pi.price,0)*${prodCount}-${discountProdPrice} ,  ${dateId} ' +
            '   from product_info pi ' +
            '   left join sale_service_prod_rel sspl on sspl.product_id = pi.id ' +
            '   where pi.id is not null and pi.id = ${productId} )  ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        if(params.saleUserId){
            valueObj.saleUserId = params.saleUserId;
        }else{
            valueObj.saleUserId = 1;
        }
        if(params.saleUserName){
            valueObj.saleUserName = params.saleUserName;
        }else{
            valueObj.saleUserName = '';
        }
        valueObj.remark = params.remark;
        valueObj.orderId = params.orderId;
        valueObj.clientId = params.clientId;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.orderItemType = params.orderItemType;
        valueObj.prodCount = params.prodCount;
        valueObj.prodCount = params.prodCount;
        valueObj.discountProdPrice = params.discountProdPrice;
        valueObj.prodCount = params.prodCount;
        valueObj.discountProdPrice = params.discountProdPrice;
        valueObj.dateId = params.dateId;
        valueObj.productId = params.prodId;
        logger.debug(' addItemProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateItemProd(params){
        let query = 'update order_item_prod ' +
            ' set op_user=${opUser} , remark = ${remark} , prod_count = ${prodCount} , prod_price =  unit_price * ${prodCount} ' +
            '  , discount_prod_price = ${discountProdPrice} , actual_prod_price =  unit_price * ${prodCount} - ${discountProdPrice} ' +
            '  where id=${orderItemProdId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.prodCount = params.prodCount;
        valueObj.prodCount = params.prodCount;
        valueObj.discountProdPrice = params.discountProdPrice;
        valueObj.prodCount = params.prodCount;
        valueObj.discountProdPrice = params.discountProdPrice;
        valueObj.orderItemProdId = params.orderItemProdId;
        logger.debug(' updateItemProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_item_prod set status=${status} , op_user=${opUser} ' +
            ' where id=${orderItemProdId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderItemProdId = params.orderItemProdId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteItemProd(params){
        const query = 'delete from order_item_prod ' +
            ' where id = ${orderItemProdId} ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.orderItemProdId =params.orderItemProdId ;
        logger.debug(' deleteItemProd ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = OrderItemProdDAO;