const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderItemServiceDAO.js');

class OrderRefundServiceDAO  {
    static async queryRefundService(params) {
        let query = "select ors.* , ui.real_name " +
            "   from order_refund_service ors " +
            "   left join user_info ui on ui.id = ors.op_user " +
            "   where ors.id is not null ";
        let filterObj = {};
        if(params.orderRefundServiceId){
            query += " and ors.id = ${orderRefundServiceId} ";
            filterObj.orderRefundServiceId = params.orderRefundServiceId;
        }
        if(params.status){
            query += " and ors.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.orderRefundId){
            query += " and ors.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderId){
            query += " and ors.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.itemServiceId){
            query += " and ors.item_service_id = ${itemServiceId} ";
            filterObj.itemServiceId = params.itemServiceId;
        }
        if(params.dateStart){
            query += " and ors.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and ors.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        query = query + '  order by ors.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryRefundService ');
        return await pgDb.any(query,filterObj);
    }

    static async queryRefundServiceCount(params) {
        let query = "select count(ors.id) " +
            "   from order_refund_service ors " +
            "   left join user_info ui on ui.id = ors.op_user " +
            "   where ors.id is not null ";
        let filterObj = {};
        if(params.orderRefundServiceId){
            query += " and ors.id = ${orderRefundServiceId} ";
            filterObj.orderRefundServiceId = params.orderRefundServiceId;
        }
        if(params.status){
            query += " and ors.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.orderRefundId){
            query += " and ors.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderId){
            query += " and ors.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.itemServiceId){
            query += " and ors.item_service_id = ${itemServiceId} ";
            filterObj.itemServiceId = params.itemServiceId;
        }
        if(params.dateStart){
            query += " and ors.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and ors.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        logger.debug(' queryRefundServiceCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addRefundService(params) {
        let query = ' INSERT INTO order_refund_service( ' +
            ' op_user, remark, order_refund_id, order_id, ' +
            ' item_service_id, service_refund_price, date_id) ' +
            ' ( select ${opUser} , ${remark} , ${orderRefundId} , ${orderId} , ' +
            ' ${itemServiceId} , ${serviceRefundPrice} , ${dateId} ' +
            ' from order_item_service ois ' +
            ' where ois.id = ${itemServiceId} ' +
            ' and ois.id is not null ' +
            ' ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.orderRefundId = params.orderRefundId;
        valueObj.orderId = params.orderId;
        valueObj.itemServiceId = params.itemServiceId;
        valueObj.serviceRefundPrice = params.serviceRefundPrice;
        valueObj.dateId = params.dateId;
        valueObj.itemServiceId = params.itemServiceId;
        valueObj.serviceRefundCount = params.serviceRefundCount;
        logger.debug(' addRefundService ');
        return await pgDb.any(query,valueObj);
    }

    static async updateRefundService(params){
        let query = 'update order_refund_service set remark = ${remark}, service_refund_price = ${serviceRefundPrice} ' +
            ' where id = ${orderRefundServiceId} RETURNING id ';
        let valueObj = {};
        valueObj.remark = params.remark;
        valueObj.serviceRefundPrice = params.serviceRefundPrice;
        valueObj.orderRefundServiceId  = params.orderRefundServiceId ;
        logger.debug(' updateRefundService ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_refund_service set status=${status} , op_user=${opUser} ' +
            ' where id=${orderRefundServiceId } RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderRefundServiceId   = params.orderRefundServiceId  ;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = OrderRefundServiceDAO;