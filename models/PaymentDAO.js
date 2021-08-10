const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentDAO.js');

class PaymentDAO  {
    static async queryPayment(params) {
        let query = "select pi.*, ui.real_name " +
            " from payment_info pi " +
            " left join user_info ui on ui.id = pi.op_user " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.paymentId){
            query += " and pi.id = ${paymentId} ";
            filterObj.paymentId = params.paymentId;
        }
        if(params.type){
            query += " and pi.type = ${type} ";
            filterObj.type = params.type;
        }
        if(params.paymentType){
            query += " and pi.payment_type = ${paymentType} ";
            filterObj.paymentType = params.paymentType;
        }
        if(params.dateStart){
            query += " and pi.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and pi.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
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
        logger.debug(' queryPayment ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPaymentCount(params) {
        let query = "select count(id) from payment_info pi where pi.id is not null ";
        let filterObj = {};
        if(params.paymentId){
            query += " and pi.id = ${paymentId} ";
            filterObj.paymentId = params.paymentId;
        }
        if(params.type){
            query += " and pi.type = ${type} ";
            filterObj.type = params.type;
        }
        if(params.paymentType){
            query += " and pi.payment_type = ${paymentType} ";
            filterObj.paymentType = params.paymentType;
        }
        if(params.dateStart){
            query += " and pi.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        logger.debug(' queryPaymentCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addPayment(params) {
        let query = 'INSERT INTO payment_info ( op_user, remark, type, payment_type, ' +
            ' order_count, prod_count, prod_price, service_count, service_price, total_order_price, ' +
            ' order_refund_count, refund_prod_count, refund_prod_price, refund_service_count, refund_service_price, total_refund_price, ' +
            ' plan_price, actual_price, date_id ) ' +
            ' ( select ${opUser} , ${remark}, ${type} , ${paymentType}, ' +
            ' or_in.order_count, or_in.prod_count, or_in.prod_price, ' +
            ' or_in.service_count, or_in.service_price, or_in.total_order_price, ' +
            ' or_re.order_refund_count, or_re.refund_prod_count, or_re.refund_prod_price, ' +
            ' or_re.refund_service_count, or_re.refund_service_price, or_re.total_refund_price, ' +
            ' or_in.total_order_price - or_re.total_refund_price as plan_price, ' +
            ' ${actualPrice}, ${dateId} ' +
            ' from ( ' +
            '  select  count(oi.id) as order_count , ' +
            '  COALESCE(sum(oi.prod_count),0) as prod_count , ' +
            '  COALESCE(sum(oi.prod_price),0) as prod_price,  ' +
            '  COALESCE(sum(oi.service_count),0) as service_count, ' +
            '  COALESCE(sum(oi.service_price),0) as service_price, ' +
            '  COALESCE(sum(oi.prod_price) + sum(oi.service_price),0) as total_order_price ' +
            '  from order_info oi ' +
            '  where oi.id in (${orderIds:csv}) ' +
            '   and oi.payment_status = 1 ' +
            '  ) as or_in, ' +
            '  (  ' +
            '  select  count(of.id) as order_refund_count, ' +
            '  COALESCE(sum(of.prod_refund_count),0) as refund_prod_count, ' +
            '  COALESCE(sum(of.prod_refund_price),0) as refund_prod_price,  ' +
            '  COALESCE(sum(of.service_refund_count),0) as refund_service_count, ' +
            '  COALESCE(sum(of.service_refund_price),0) as refund_service_price,  ' +
            '  COALESCE(sum(of.prod_refund_price) + sum(of.service_refund_price),0) as total_refund_price  ' +
            '  from order_refund of  ' +
            '  where of.order_id in (${orderRefundIds:csv}) ' +
            '   and of.payment_status = 1' +
            '  ) as or_re ' +
            ' ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.type = params.type;
        valueObj.paymentType = params.paymentType;
        valueObj.actualPrice = params.actualPrice;
        valueObj.dateId = params.dateId;
        valueObj.orderIds = params.orderIds;
        valueObj.orderRefundIds = params.orderRefundIds;

        logger.debug(' addPayment ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePayment(params){
        const query = 'update payment_info set op_user=${opUser}, remark=${remark}, ' +
            ' payment_type=${paymentType}, actual_price=${actualPrice} ' +
            ' where id =${paymentId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.paymentType = params.paymentType;
        valueObj.actualPrice = params.actualPrice;
        valueObj.paymentId = params.paymentId;
        logger.debug(' updatePayment ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        let query = 'update payment_info set status=${status} ' ;
        if(params.dateId){
            query = query +  ', date_id=${dateId}' ;
        }
        query = query + ' where id =${paymentId} RETURNING id ';
        let valueObj = {};

        valueObj.status = params.status;
        if(params.dateId){
            valueObj.dateId = params.dateId;
        }
        valueObj.paymentId = params.paymentId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deletePayment(params){
        const query = 'delete from payment_info where id =${paymentId} and status = 0 RETURNING id ';
        let valueObj = {};
        valueObj.paymentId =params.paymentId;
        logger.debug(' deletePayment ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = PaymentDAO;