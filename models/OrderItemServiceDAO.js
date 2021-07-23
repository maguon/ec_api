const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderItemServiceDAO.js');

class OrderItemServiceDAO  {
    static async queryItemService(params) {
        let query = "select ois.* , ui.real_name " +
            " from order_item_service ois " +
            " left join user_info ui on ui.id = ois.op_user " +
            " where ois.id is not null ";
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
        logger.debug(' queryItemService ');
        return await pgDb.any(query,filterObj);
    }

    static async queryItemServiceCount(params) {
        let query = "select count(ois.id) from order_item_service ois where ois.id is not null ";
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

        logger.debug(' queryItemServiceCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addItemService(params) {
        const query = 'INSERT INTO order_item_service ( ' +
            ' op_user, sale_user_id, sale_user_name, deploy_user_id, ' +
            ' deploy_user_name, remark, ' +
            ' order_id, client_id, client_agent_id, order_item_type, ' +
            ' sale_service_id, sale_service_name, fixed_price, unit_price, ' +
            ' service_count, service_price, discount_service_price, ' +
            ' actual_service_price, date_id ) ' +
            ' ( select ${opUser} , ${saleUserId} , ${saleUserName} , ${deployUserId} , ' +
            ' ${deployUserName} , ${remark} , ' +
            ' ${orderId} , ${clientId} , ${clientAgentId} , ${orderItemType} , ' +
            ' ssi.id , ssi.service_name , ssi.fixed_price , ssi.unit_price , ' +
            ' ssi.service_price_count , ' +
            '   ( case when ssi.service_cost_type = 1 ' +
            '        then ssi.fixed_price*ssi.service_price_count ' +
            '        else ssi.unit_price*ssi.service_price_count end )as service_price , ' +
            ' ${discountServicePrice} , ' +
            '   ( case when ssi.service_cost_type = 1 ' +
            '       then ssi.fixed_price*ssi.service_price_count-${discountServicePrice} ' +
            '       else ssi.unit_price*ssi.service_price_count-${discountServicePrice} end )as service_price , ' +
            ' ${dateId} ' +
            ' from sale_service_info ssi ' +
            ' where ssi.id = ${saleServiceId}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.saleUserId = params.saleUserId;
        valueObj.saleUserName = params.saleUserName;
        valueObj.deployUserId = params.deployUserId;
        valueObj.deployUserName = params.deployUserName;
        valueObj.remark = params.remark;
        valueObj.orderId = params.orderId;
        valueObj.clientId = params.clientId;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.orderItemType = params.orderItemType;
        valueObj.discountServicePrice = params.discountServicePrice;
        valueObj.discountServicePrice = params.discountServicePrice;
        valueObj.discountServicePrice = params.discountServicePrice;
        valueObj.dateId = params.dateId;
        valueObj.saleServiceId = params.saleServiceId;
        logger.debug(' addItemService ');
        return await pgDb.any(query,valueObj);
    }

    static async updateItemService(params){
        let query = 'update order_item_service set remark = ${remark}, order_item_type = ${orderItemType} ' ;
        let valueObj = {};
        valueObj.remark = params.remark;
        valueObj.orderItemType = params.orderItemType;

        if(params.serviceCount){
            query = query + ' , service_count = ${serviceCount} , ' +
                '   service_price = ( fixed_price + unit_price ) * ${serviceCount} ';
            valueObj.serviceCount = params.serviceCount;
            valueObj.serviceCount = params.serviceCount;
        }

        if(params.discountServicePrice){
            query = query + ' , discount_service_price = ${discountServicePrice} , ' +
                'actual_service_price = ( fixed_price + unit_price ) * ${serviceCount} - ${discountServicePrice} ' ;
            valueObj.discountServicePrice = params.discountServicePrice;
            valueObj.serviceCount = params.serviceCount;
            valueObj.discountServicePrice = params.discountServicePrice;
        }

        query = query + ' where id = ${orderItemServiceId} RETURNING id ';
        valueObj.discountServicePrice = params.discountServicePrice;
        valueObj.orderItemServiceId = params.orderItemServiceId;
        logger.debug(' updateItemService ');
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

}

module.exports = OrderItemServiceDAO;