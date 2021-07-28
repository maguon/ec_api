const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderDAO.js');

class OrderDAO  {
    static async queryOrder(params) {
        let query = "select oi.* , ui.real_name , ca.name as client_agent_name " +
            " from order_info oi " +
            " left join user_info ui on ui.id = oi.op_user " +
            " left join user_info rui on rui.id = oi.re_user_id " +
            " left join user_info cui on cui.id = oi.check_user_id " +
            " left join client_agent ca on ca.id = oi.client_agent_id " +
            " where oi.id is not null ";
        let filterObj = {};
        if(params.orderId){
            query += " and oi.id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.reUserId){
            query += " and oi.re_user_id = ${reUserId} ";
            filterObj.reUserId = params.reUserId;
        }
        if(params.status){
            query += " and oi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.paymentStatus){
            query += " and oi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.orderType){
            query += " and oi.order_type = ${orderType} ";
            filterObj.orderType = params.orderType;
        }
        if(params.checkUserId){
            query += " and oi.check_user_id = ${checkUserId} ";
            filterObj.checkUserId = params.checkUserId;
        }
        if(params.clientId){
            query += " and oi.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientTel){
            query += " and oi.client_tel like '%" + params.clientTel + "%' ";
        }
        if(params.clientSerial){
            query += " and oi.client_serial like '%" + params.clientSerial + "%' ";
        }
        if(params.clientAgentId){
            query += " and oi.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.modelId){
            query += " and oi.model_id = ${modelId} ";
            filterObj.modelId = params.modelId;
        }
        if(params.dateStart){
            query += " and oi.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and oi.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        if(params.finDateStart){
            query += " and oi.fin_date_id >= ${finDateStart} ";
            filterObj.finDateStart = params.finDateStart;
        }
        if(params.finDateEnd){
            query += " and oi.fin_date_id <= ${finDateEnd} ";
            filterObj.finDateEnd = params.finDateEnd;
        }
        query = query + '  order by oi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryOrder ');
        return await pgDb.any(query,filterObj);
    }

    static async queryOrderCount(params) {
        let query = "select count(oi.id) from order_info oi where oi.id is not null ";
        let filterObj = {};
        if(params.orderId){
            query += " and oi.id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.status){
            query += " and oi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.paymentStatus){
            query += " and oi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.orderType){
            query += " and oi.order_type = ${orderType} ";
            filterObj.orderType = params.orderType;
        }
        if(params.checkUserId){
            query += " and oi.check_user_id = ${checkUserId} ";
            filterObj.checkUserId = params.checkUserId;
        }
        if(params.clientId){
            query += " and oi.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oi.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.modelId){
            query += " and oi.model_id = ${modelId} ";
            filterObj.modelId = params.modelId;
        }
        if(params.dateStart){
            query += " and oi.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and oi.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        if(params.finDateStart){
            query += " and oi.fin_date_id >= ${finDateStart} ";
            filterObj.finDateStart = params.finDateStart;
        }
        if(params.finDateEnd){
            query += " and oi.fin_date_id <= ${finDateEnd} ";
            filterObj.finDateEnd = params.finDateEnd;
        }
        logger.debug(' queryOrderCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addOrder(params) {
        const query = 'INSERT INTO order_info ( op_user, re_user_id, re_user_name, ' +
            ' client_remark, op_remark, order_type, client_id, client_agent_id, ' +
            ' client_name, client_tel, client_address, client_serial, client_serial_detail, ' +
            ' model_id, model_name, date_id ) ' +
            ' ( select ${opUser} , ${reUserId} , ${reUserName} , ' +
            ' ${clientRemark} , ${opRemark} , ${orderType} , ${clientId} , ${clientAgentId} , ' +
            ' ci.name , ci.tel , ci.address , ci.client_serial , ci.client_serial_detail , ' +
            ' ci.model_id , ci.model_name , ${dateId} ' +
            ' from client_info ci ' +
            ' where ci.id is not null ' +
            ' and ci.id = ${clientId}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.reUserId = params.reUserId;
        valueObj.reUserName = params.reUserName;
        valueObj.clientRemark = params.clientRemark;
        valueObj.opRemark = params.opRemark;
        valueObj.orderType = params.orderType;
        valueObj.clientId = params.clientId;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.dateId = params.dateId;
        valueObj.clientId = params.clientId;
        logger.debug(' addOrder ');
        return await pgDb.any(query,valueObj);
    }

    static async updateOrder(params){
        const query = ' UPDATE order_info ' +
            ' SET op_user=${opUser} , re_user_id = ${reUserId}, re_user_name = ${reUserName}, ' +
            ' client_remark = ${clientRemark}, op_remark = ${opRemark} ' +
            ' where id = ${orderId}  ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.reUserId = params.reUserId;
        valueObj.reUserName = params.reUserName;
        valueObj.clientRemark = params.clientRemark;
        valueObj.opRemark = params.opRemark;
        valueObj.orderId = params.orderId;
        logger.debug(' updateOrder ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePrice(params){
        const query = ' UPDATE order_info ' +
            ' SET service_price =  COALESCE(ois.sp,0) , prod_price =  COALESCE(oip.pp,0) ,  discount_service_price = COALESCE(ois.dsp,0), ' +
            ' discount_prod_price = COALESCE(oip.dpp,0), ' +
            ' total_discount_price = COALESCE(ois.dsp,0) +  COALESCE(oip.dpp,0) ,  actual_service_price = COALESCE(ois.asp,0) , ' +
            ' actual_prod_price = COALESCE(oip.app,0) , total_actual_price= COALESCE(ois.asp,0) + COALESCE(oip.app,0)  ' +
            ' from order_info oi ' +
            ' left join ( ' +
            '   select order_id ,sum(service_price) as sp ,sum(discount_service_price) AS dsp , sum(actual_service_price)  AS asp  ' +
            '   from order_item_service ' +
            '   where order_id = ${orderId} ' +
            '   group by order_id ' +
            ' ) as ois on oi.id = ois.order_id ' +
            ' left join ( ' +
            '   select order_id  , sum(prod_price) AS pp , sum(discount_prod_price) AS dpp , sum(actual_prod_price)  AS app ' +
            '   from order_item_prod ' +
            '   where order_id = ${orderId} ' +
            '   group by order_id ' +
            ' ) as oip on oi.id= oip.order_id ' +
            ' where oi.id =${orderId} and order_info.id = ${orderId} ' +
            ' RETURNING order_info.id ';
        let valueObj = {};
        valueObj.orderId = params.orderId;
        valueObj.orderId = params.orderId;
        valueObj.orderId = params.orderId;
        valueObj.orderId = params.orderId;
        logger.debug(' updatePrice ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_info set status=${status} , op_user=${opUser} ' +
            ' where id=${orderId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderId = params.orderId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = OrderDAO;