const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderItemServiceDAO.js');

class OrderRefundServiceDAO  {
    static async queryRefundService(params) {
        let query = "select ois.* , ui.real_name ," +
            "   oi.status as or_status , oi.payment_status as or_payment_status , oi.re_user_id as or_re_user_id , " +
            "   oi.re_user_name as or_re_user_name , oi.order_type as or_order_type , oi.client_name as or_client_name , " +
            "   oi.date_id as or_date_id , oi.fin_date_id as or_fin_date_id " +
            "   from order_refund_service ois " +
            "   left join user_info ui on ui.id = ois.op_user " +
            "   left join order_info oi on oi.id = ois.order_id " +
            "   where ois.id is not null ";
        let filterObj = {};
        if(params.orderItemServiceId){
            query += " and ois.id = ${orderItemServiceId} ";
            filterObj.orderItemServiceId = params.orderItemServiceId;
        }
        if(params.status){
            query += " and ois.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and ois.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.deployUserId){
            query += " and ois.deploy_user_id = ${deployUserId} ";
            filterObj.deployUserId = params.deployUserId;
        }
        if(params.checkUserId){
            query += " and ois.check_user_id = ${checkUserId} ";
            filterObj.checkUserId = params.checkUserId;
        }
        if(params.orderId){
            query += " and ois.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and ois.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and ois.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.saleServiceId){
            query += " and ois.sale_service_id = ${saleServiceId} ";
            filterObj.saleServiceId = params.saleServiceId;
        }
        if(params.dateStart){
            query += " and ois.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and ois.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        if(params.finDateStart){
            query += " and ois.fin_date_id >= ${finDateStart} ";
            filterObj.finDateStart = params.finDateStart;
        }
        if(params.finDateEnd){
            query += " and ois.fin_date_id <= ${finDateEnd} ";
            filterObj.finDateEnd = params.finDateEnd;
        }
        query = query + '  order by ois.id desc ';
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
        let query = "select count(ois.id) from order_refund_service ois where ois.id is not null ";
        let filterObj = {};
        if(params.orderItemServiceId){
            query += " and ois.id = ${orderItemServiceId} ";
            filterObj.orderItemServiceId = params.orderItemServiceId;
        }
        if(params.status){
            query += " and ois.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and ois.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.deployUserId){
            query += " and ois.deploy_user_id = ${deployUserId} ";
            filterObj.deployUserId = params.deployUserId;
        }
        if(params.checkUserId){
            query += " and ois.check_user_id = ${checkUserId} ";
            filterObj.checkUserId = params.checkUserId;
        }
        if(params.orderId){
            query += " and ois.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and ois.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and ois.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.saleServiceId){
            query += " and ois.sale_service_id = ${saleServiceId} ";
            filterObj.saleServiceId = params.saleServiceId;
        }
        if(params.dateStart){
            query += " and ois.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and ois.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        if(params.finDateStart){
            query += " and ois.fin_date_id >= ${finDateStart} ";
            filterObj.finDateStart = params.finDateStart;
        }
        if(params.finDateEnd){
            query += " and ois.fin_date_id <= ${finDateEnd} ";
            filterObj.finDateEnd = params.finDateEnd;
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
        let query = 'update order_refund_service set remark = ${remark}, order_item_type = ${orderItemType} ' ;
        let valueObj = {};
        valueObj.remark = params.remark;
        valueObj.orderItemType = params.orderItemType;

        if(params.discountServicePrice || params.discountServicePrice ==0){
            query = query + ' , discount_service_price = ${discountServicePrice} , ' +
                'actual_service_price = ( fixed_price + unit_price  * service_count ) - ${discountServicePrice} ' ;
            valueObj.discountServicePrice = params.discountServicePrice;
            valueObj.discountServicePrice = params.discountServicePrice;
        }

        query = query + ' where id = ${orderItemServiceId} RETURNING id ';
        valueObj.orderItemServiceId = params.orderItemServiceId;
        logger.debug(' updateRefundService ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_item_service set status=${status} , op_user=${opUser} ' +
            ' where id=${orderItemServiceId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderItemServiceId = params.orderItemServiceId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteItemService(params){
        const query = 'delete from order_item_service ' +
            ' where id = ${orderItemServiceId} ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.orderItemServiceId =params.orderItemServiceId;
        logger.debug(' deleteItemService ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = OrderRefundServiceDAO;