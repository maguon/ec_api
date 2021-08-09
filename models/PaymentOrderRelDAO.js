const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentOrderRelDAO.js');

class PaymentOrderRelDAO  {
    static async queryPaymentOrderRel(params) {
        let query = "SELECT por.* ,pi.status as p_status, pi.remark as p_remark, pi.type as p_type, " +
            " pi.payment_type as p_payment_type, pi.order_count as p_order_count, " +
            " pi.prod_count as p_prod_count, pi.prod_price as p_prod_price, " +
            " pi.service_count as p_service_count, pi.service_price as p_service_price, " +
            " pi.total_order_price as p_total_order_price, " +
            " pi.order_refund_count as p_order_refund_count , pi.refund_prod_count as p_refund_prod_count, " +
            " pi.refund_prod_price as p_refund_prod_price, pi.refund_service_count as p_refund_service_count , " +
            " pi.refund_service_price as p_refund_service_price, pi.total_refund_price as p_total_refund_price , " +
            " pi.plan_price as p_plan_price, pi.actual_price as p_actual_price, pi.date_id as p_date_id " +
            " FROM payment_order_rel por " +
            " left join order_info oi on oi.id = por.order_id " +
            " left join payment_info pi on pi.id = por.payment_id " +
            " left join order_refund orf on orf.id = por.order_refund_id " +
            " where por.id is not null ";
        let filterObj = {};
        if(params.paymentOrderRelId){
            query += " and por.id = ${paymentOrderRelId} ";
            filterObj.paymentOrderRelId = params.paymentOrderRelId;
        }
        if(params.orderId){
            query += " and por.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.orderRefundId){
            query += " and por.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.paymentId){
            query += " and por.payment_idd = ${paymentId} ";
            filterObj.paymentId = params.paymentId;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        query = query + '  order by por.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryPaymentOrderRel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPaymentOrderRelCount(params) {
        let query = "SELECT count(por.id) " +
            " FROM payment_order_rel por " +
            " left join order_info oi on oi.id = por.order_id " +
            " left join payment_info pi on pi.id = por.payment_id " +
            " left join order_refund orf on orf.id = por.order_refund_id " +
            " where por.id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and por.id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.orderId){
            query += " and por.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.orderRefundId){
            query += " and por.order_refund_id = ${orderRefundId} ";
            filterObj.orderRefundId = params.orderRefundId;
        }
        if(params.paymentId){
            query += " and por.payment_idd = ${paymentId} ";
            filterObj.paymentId = params.paymentId;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        logger.debug(' queryPaymentOrderRelCount ');
        return await pgDb.one(query,filterObj);
    }

    //根据 orderIds 创建关联信息
    static async addPaymentOrderRelByOrder(params) {
        let query = ' INSERT INTO payment_order_rel( ' +
            ' op_user, order_id, payment_id ) ' +
            ' ( select ${opUser} , oi.id as order_id , ${paymentId} ' +
            ' from order_info oi ' +
            ' where oi.id in (${orderIds:csv})' +
            ' ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.paymentId = params.paymentId;
        valueObj.orderIds = params.orderIds;

        logger.debug(' addPaymentOrderRelByOrder ');
        return await pgDb.any(query,valueObj);
    }

    //根据 orderRefundIds 创建关联信息
    static async addPaymentOrderRelByRefund(params) {
        let query = ' INSERT INTO payment_order_rel( ' +
            ' op_user, order_id, order_refund_id, payment_id ) ' +
            ' ( select ${opUser} , orf.order_id as order_id , ' +
            ' orf.id as order_refund_id , ${paymentId} ' +
            ' from order_refund orf ' +
            ' where orf.order_id in (${orderRefundIds:csv})' +
            ' ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.paymentId = params.paymentId;
        valueObj.orderRefundIds = params.orderRefundIds;

        logger.debug(' addPaymentOrderRelByRefund ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePaymentOrderRel(params){
        const query = 'update payment_order_rel set op_user=${opUser}, remark=${remark} ' +
            ' where id =${paymentOrderRelId } RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.paymentOrderRelId  = params.paymentOrderRelId ;
        logger.debug(' updatePaymentOrderRel ');
        return await pgDb.any(query,valueObj);
    }

    //根据 paymentId 删除关联信息
    static async deletePayment(params){
        const query = 'delete from payment_order_rel where payment_id =${paymentId} RETURNING id ';
        let valueObj = {};
        valueObj.paymentId =params.paymentId;
        logger.debug(' deletePayment ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = PaymentOrderRelDAO;