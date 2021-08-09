const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderRefundDAO.js');

class OrderRefundDAO  {

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