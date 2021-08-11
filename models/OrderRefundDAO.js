const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderRefundDAO.js');

class OrderRefundDAO  {

    static async queryOrderRefund(params) {
        let query = "select orf.* , ui.real_name " +
            " from order_refund orf " +
            " left join user_info ui on ui.id = orf.op_user " +
            " where orf.id is not null ";
        let filterObj = {};
        if(params.orderRefundId){
            query += " and orf.id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderId){
            query += " and orf.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.status){
            query += " and orf.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.paymentStatus){
            query += " and orf.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.paymentType){
            query += " and orf.payment_type = ${paymentType} ";
            filterObj.paymentType = params.paymentType;
        }
        if(params.dateStart){
            query += " and orf.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and orf.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        query = query + '  order by orf.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryOrderRefund ');
        return await pgDb.any(query,filterObj);
    }

    static async queryOrderRefundCount(params) {
        let query = "select count(orf.id) " +
            " from order_refund orf " +
            " left join user_info ui on ui.id = orf.op_user " +
            " where orf.id is not null ";
        let filterObj = {};
        if(params.orderRefundId){
            query += " and orf.id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.orderId){
            query += " and orf.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.status){
            query += " and orf.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.paymentType){
            query += " and orf.payment_type = ${paymentType} ";
            filterObj.paymentType = params.paymentType;
        }
        if(params.dateStart){
            query += " and orf.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and orf.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        logger.debug(' queryOrderRefundCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addOrderRefund(params) {
        const query = 'INSERT INTO order_refund( ' +
            ' op_user, remark, payment_type, order_id, date_id ,transfer_refund_price) ' +
            ' VALUES ( ${opUser} , ${remark} , ${paymentType} , ${orderId} , ${dateId} , ${transferRefundPrice}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        if(params.paymentType){
            valueObj.paymentType = params.paymentType;
        }else{
            valueObj.paymentType = 1;
        }
        valueObj.orderId = params.orderId;
        valueObj.dateId = params.dateId;
        valueObj.transferRefundPrice = params.transferRefundPrice;
        logger.debug(' addOrderRefund ');
        return await pgDb.any(query,valueObj);
    }

    static async updateOrderRefund(params){
        const query = ' UPDATE order_refund ' +
            ' SET op_user=${opUser} , remark = ${remark} , payment_type = ${paymentType} ' +
            ' where id = ${orderRefundId}  ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.paymentType = params.paymentType;
        valueObj.orderRefundId  = params.orderRefundId ;
        logger.debug(' updateOrderRefund ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePrice(params){
        const query = ' UPDATE order_refund ' +
            ' SET service_refund_price = COALESCE(ors.service_refund_price,0) , prod_refund_price = COALESCE(orp.prod_refund_price,0) , ' +
            ' total_refund_price = COALESCE(ors.service_refund_price,0) + COALESCE(orp.prod_refund_price,0) , ' +
            ' prod_refund_count = COALESCE(orp.prod_refund_count,0) , service_refund_count = COALESCE(ors.service_refund_count,0) ' +
            ' from ( ' +
            '  select order_Refund_id, sum(prod_refund_count) as prod_refund_count , ' +
            '  sum(total_refund_price) as prod_refund_price ' +
            '  from order_refund_prod  ' +
            '  where order_refund_id = ${orderRefundId} ' +
            '  group by order_refund_id ' +
            ' ) as orp ' +
            ' left join ( ' +
            '  select order_refund_id, count(id) as service_refund_count , ' +
            '  sum(service_refund_price) as service_refund_price ' +
            '  from order_refund_service ' +
            '  where order_refund_id = ${orderRefundId} ' +
            '  group by order_refund_id ' +
            ' ) as ors on ors.order_refund_id = orp.order_refund_id ' +
            ' where order_refund.id = ${orderRefundId} ' +
            ' RETURNING order_refund.id ';
        let valueObj = {};
        valueObj.orderRefundId = params.orderRefundId;
        valueObj.orderRefundId = params.orderRefundId;
        valueObj.orderRefundId = params.orderRefundId;
        logger.debug(' updatePrice ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_refund set status=${status} , op_user=${opUser} ' +
        ' where id=${orderRefundId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderRefundId = params.orderRefundId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    //根据 payment_order_rel 的 payment_id 更新 payment_status
    static async updatePaymentStatus(params){
        let query = 'update order_Refund orf set payment_status=${paymentStatus} , op_user=${opUser} ' ;
        if(params.dateId){
            query = query + ' , date_id=${dateId} ' ;
        }
        query = query +  ' from payment_order_rel por ' +
            ' where por.order_refund_id = orf.id ' +
            ' and por.payment_id = ${paymentId} ';
        let valueObj = {};
        valueObj.paymentStatus = params.paymentStatus;
        valueObj.opUser = params.opUser;
        if(params.dateId){
            valueObj.dateId = params.dateId;
        }
        valueObj.paymentId = params.paymentId;
        logger.debug(' updatePaymentStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = OrderRefundDAO;