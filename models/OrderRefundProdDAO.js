const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderRefundProdDAO.js');

class OrderRefundProdDAO  {
    static async queryRefundProd(params) {
        let query = "select oip.* , ui.real_name , " +
            "   oi.status as or_status , oi.payment_status as or_payment_status , oi.re_user_id as or_re_user_id ," +
            "   oi.re_user_name as or_re_user_name , oi.order_type as or_order_type , oi.client_id as or_client_id , " +
            "   oi.client_agent_id as or_client_agent_id , oi.client_name as or_client_name , " +
            "   oi.date_id as or_date_id , oi.fin_date_id as or_fin_date_id  " +
            "   from order_refund_prod oip " +
            "   left join user_info ui on ui.id = oip.op_user " +
            "   left join order_info oi on oi.id = oip.order_id " +
            "   where oip.id is not null ";
        let filterObj = {};
        if(params.orderRefundProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderRefundProdId = params.orderRefundProdId;
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
        logger.debug(' queryRefundProd ');
        return await pgDb.any(query,filterObj);
    }

    static async queryRefundProdCount(params) {
        let query = "select count(oip.id) from order_refund_prod oip where oip.id is not null ";
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
        logger.debug(' queryRefundProdCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addRefundProd(params) {
        const query = ' INSERT INTO order_refund_prod( ' +
            ' op_user , remark , order_refund_id , order_id , item_prod_id , ' +
            ' prod_id, prod_name , prod_refund_count , prod_refund_price , total_refund_price , date_id) ' +
            ' ( select ${opUser} , ${remark} , ${orderRefundId} , ${orderId} , ${itemProdId} , ' +
            ' oip.prod_id , oip.prod_name , ${prodRefundCount} , ${prodRefundPrice} , ${totalRefundPrice} , ${dateId} ' +
            ' from order_item_prod oip ' +
            ' where oip.id = ${itemProdId} ' +
            ' and oip.id is not null ' +
            ' ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.orderRefundId = params.orderRefundId;
        valueObj.orderId = params.orderId;
        valueObj.orderItemId = params.orderItemId;
        valueObj.prodRefundCount = params.prodRefundCount;
        valueObj.prodRefundPrice = params.prodRefundPrice;
        valueObj.totalRefundPrice = params.prodRefundCount * params.prodRefundPrice;
        valueObj.dateId = params.dateId;
        valueObj.itemProdId = params.itemProdId;
        valueObj.prodRefundCount = params.prodRefundCount;
        logger.debug(' addRefundProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateRefundProd(params){
        let query = 'update order_refund_prod ' +
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
        logger.debug(' updateRefundProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_refund_prod set status=${status} , op_user=${opUser} ' +
            ' where id=${orderItemProdId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderItemProdId = params.orderItemProdId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteRefundProd(params){
        const query = 'delete from order_refund_prod ' +
            ' where id = ${orderItemProdId} ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.orderItemProdId =params.orderItemProdId ;
        logger.debug(' deleteRefundProd ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = OrderRefundProdDAO;