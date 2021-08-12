const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderRefundProdDAO.js');

class OrderRefundProdDAO  {
    static async queryRefundProd(params) {
        let query = "select orp.* , ui.real_name , " +
            "   oip.unit_price , oip.prod_count , oip.prod_price , " +
            "   oip.discount_prod_price , oip.actual_prod_price" +
            "   from order_refund_prod orp " +
            "   left join user_info ui on ui.id = orp.op_user " +
            "   left join order_item_prod oip on oip.id = orp.item_prod_id " +
            "   where orp.id is not null ";
        let filterObj = {};
        if(params.orderRefundProdId){
            query += " and orp.id = ${orderRefundProdId} ";
            filterObj.orderRefundProdId = params.orderRefundProdId;
        }
        if(params.status){
            query += " and orp.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.orderRefundId){
            query += " and orp.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderId){
            query += " and orp.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.itemProdId){
            query += " and orp.item_prod_id = ${itemProdId} ";
            filterObj.itemProdId = params.itemProdId;
        }
        if(params.prodId){
            query += " and orp.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.dateStart){
            query += " and orp.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and orp.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        query = query + '  order by orP.id desc ';
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
        let query = "select count(orp.id)" +
            "   from order_refund_prod orp " +
            "   left join user_info ui on ui.id = orp.op_user " +
            "   left join order_item_prod oip on oip.id = orp.item_prod_id " +
            "   where orp.id is not null ";
        let filterObj = {};
        if(params.orderRefundProdId){
            query += " and orp.id = ${orderRefundProdId} ";
            filterObj.orderRefundProdId = params.orderRefundProdId;
        }
        if(params.status){
            query += " and orp.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.orderRefundId){
            query += " and orp.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderId){
            query += " and orp.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.prodId){
            query += " and orp.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.dateStart){
            query += " and orp.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and orp.date_id <= ${dateEnd} ";
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
        valueObj.itemProdId = params.itemProdId;
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
            ' set op_user=${opUser} , remark = ${remark} , ' +
            ' prod_refund_count = ${prodRefundCount} , prod_refund_price = ${prodRefundPrice} , ' +
            ' total_refund_price = ${totalRefundPrice}' +
            ' where id=${orderRefundProdId } RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.prodRefundCount = params.prodRefundCount;
        valueObj.prodRefundPrice = params.prodRefundPrice;
        valueObj.totalRefundPrice = params.prodRefundCount * params.prodRefundPrice;
        valueObj.orderRefundProdId = params.orderRefundProdId;
        logger.debug(' updateRefundProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_refund_prod set status=${status} , op_user=${opUser} ' +
            ' where id=${orderRefundProdId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderRefundProdId = params.orderRefundProdId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteRefundProd(params){
        const query = 'delete from order_refund_prod ' +
            ' where id = ${orderRefundProdId} ' +
            ' and order_id = ${orderId} ' +
            ' and order_refund_id = ${orderRefundId} ' +
            ' and item_prod_id = ${itemProdId} ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.orderRefundProdId =params.orderRefundProdId ;
        valueObj.orderId =params.orderId ;
        valueObj.orderRefundId =params.orderRefundId ;
        valueObj.itemProdId =params.itemProdId ;
        logger.debug(' deleteRefundProd ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = OrderRefundProdDAO;