const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderItemServiceDAO.js');

class OrderItemServiceDAO  {
    static async queryItemService(params) {
        let query = "select ois.* , ui.real_name ," +
            "   oi.status as or_status , oi.payment_status as or_payment_status , oi.re_user_id as or_re_user_id , " +
            "   oi.re_user_name as or_re_user_name , oi.order_type as or_order_type , oi.client_name as or_client_name , " +
            "   ca.name as or_client_agent_name , oi.client_tel as or_client_tel , " +
            "   oi.client_address as or_client_address , oi.client_serial as or_client_serial , " +
            "   oi.client_serial_detail as or_client_serial_detail, " +
            "   oi.date_id as or_date_id , oi.fin_date_id as or_fin_date_id , " +
            "   ssi.service_type , ssi.service_part_type " +
            "   from order_item_service ois " +
            "   left join user_info ui on ui.id = ois.op_user " +
            "   left join order_info oi on oi.id = ois.order_id " +
            "   left join client_agent ca on ca.id = oi.client_agent_id " +
            "   left join sale_service_info ssi on ssi.id = ois.sale_service_id " +
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
        if(params.clientTel){
            query += " and oi.client_tel like '%" + params.clientTel + "%' ";
        }
        if(params.clientSerial){
            query += " and oi.client_serial like '%" + params.clientSerial + "%' ";
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
            query += " and oi.fin_date_id >= ${finDateStart} ";
            filterObj.finDateStart = params.finDateStart;
        }
        if(params.finDateEnd){
            query += " and oi.fin_date_id <= ${finDateEnd} ";
            filterObj.finDateEnd = params.finDateEnd;
        }
        if(params.serviceType){
            query += " and ssi.service_type = ${serviceType} ";
            filterObj.serviceType = params.serviceType;
        }
        if(params.servicePartType){
            query += " and ssi.service_part_type = ${servicePartType} ";
            filterObj.servicePartType = params.servicePartType;
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
        let query = "select count(ois.id) " +
            "   from order_item_service ois " +
            "   left join user_info ui on ui.id = ois.op_user " +
            "   left join order_info oi on oi.id = ois.order_id " +
            "   left join client_agent ca on ca.id = oi.client_agent_id " +
            "   left join sale_service_info ssi on ssi.id = ois.sale_service_id " +
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
        if(params.clientTel){
            query += " and oi.client_tel like '%" + params.clientTel + "%' ";
        }
        if(params.clientSerial){
            query += " and oi.client_serial like '%" + params.clientSerial + "%' ";
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
            query += " and oi.fin_date_id >= ${finDateStart} ";
            filterObj.finDateStart = params.finDateStart;
        }
        if(params.finDateEnd){
            query += " and oi.fin_date_id <= ${finDateEnd} ";
            filterObj.finDateEnd = params.finDateEnd;
        }
        if(params.serviceType){
            query += " and ssi.service_type = ${serviceType} ";
            filterObj.serviceType = params.serviceType;
        }
        if(params.servicePartType){
            query += " and ssi.service_part_type = ${servicePartType} ";
            filterObj.servicePartType = params.servicePartType;
        }
        logger.debug(' queryItemServiceCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addItemService(params) {
        let query = 'INSERT INTO order_item_service ( ' +
            ' op_user ';
        let valueObj = {};
        valueObj.opUser = params.opUser;

        if(params.saleUserId){
            query = query + ' , sale_user_id ';
        }
        if(params.saleUserName){
            query = query + ' , sale_user_name ';
        }
        if(params.deployUserId){
            query = query + ' , deploy_user_id ';
        }
        if(params.deployUserName){
            query = query + ' , deploy_user_name ';
        }

        query = query + ' , remark, order_id, client_id, client_agent_id, order_item_type, ' +
            ' sale_service_id, sale_service_name, fixed_price, unit_price, ' +
            ' service_count, service_price, discount_service_price, ' +
            ' actual_service_price, date_id ) ' +
            ' ( select ${opUser} ';

        if(params.saleUserId){
            query = query + ' , ${saleUserId} ';
            valueObj.saleUserId = params.saleUserId;
        }
        if(params.saleUserName){
            query = query + ' , ${saleUserName} ';
            valueObj.saleUserName = params.saleUserName;
        }
        if(params.deployUserId){
            query = query + ' , ${deployUserId} ';
            valueObj.deployUserId = params.deployUserId;
        }
        if(params.deployUserName){
            query = query + ' , ${deployUserName} ';
            valueObj.deployUserName = params.deployUserName;
        }

        query = query + ' , ${remark} , ' +
            ' ${orderId} , ${clientId} , ${clientAgentId} , ${orderItemType} , ' +
            ' ssi.id , ssi.service_name , ssi.fixed_price , ssi.unit_price , ' +
            ' ssi.service_price_count , ' +
            '   ( case when ssi.service_price_type = 1 ' +
            '        then ssi.fixed_price ' +
            '        else ssi.unit_price*ssi.service_price_count end )as service_price , ' +
            ' ${discountServicePrice} , ' +
            '   ( case when ssi.service_price_type = 1 ' +
            '       then ssi.fixed_price - ${discountServicePrice} ' +
            '       else ssi.unit_price*ssi.service_price_count-${discountServicePrice} end )as actual_service_price , ' +
            ' ${dateId} ' +
            ' from sale_service_info ssi ' +
            ' where ssi.id = ${saleServiceId}) RETURNING id ';

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

        if(params.discountServicePrice || params.discountServicePrice ==0){
            query = query + ' , discount_service_price = ${discountServicePrice} , ' +
                'actual_service_price = ( fixed_price + unit_price  * service_count ) - ${discountServicePrice} ' ;
            valueObj.discountServicePrice = params.discountServicePrice;
            valueObj.discountServicePrice = params.discountServicePrice;
        }

        query = query + ' where id = ${orderItemServiceId} RETURNING id ';
        valueObj.orderItemServiceId = params.orderItemServiceId;
        logger.debug(' updateItemService ');
        return await pgDb.any(query,valueObj);
    }

    static async updateDeploy(params){
        let query = 'update order_item_service set deploy_user_id = ${deployUserId}, ' +
            ' deploy_user_name = ${deployUserName} , status = 3 , deploy_perf = ssi.deploy_perf ' +
            ' from order_item_service ois ' +
            ' left join ( select id,( case ' +
            ' when deploy_perf_type=2 then deploy_perf_fixed ' +
            ' when deploy_perf_type=3 then deploy_perf_fixed * deploy_perf_ratio ' +
            '  else 0 end ) as deploy_perf ' +
            ' from sale_service_info ' +
            ' where id is not null ' +
            ' ) as ssi on ssi.id = ois.sale_service_id' +
            ' where order_item_service.id = ${orderItemServiceId} RETURNING order_item_service.id ';
        let valueObj = {};
        valueObj.deployUserId = params.deployUserId;
        valueObj.deployUserName = params.deployUserName;
        valueObj.orderItemServiceId = params.orderItemServiceId;
        logger.debug(' updateDeployAndStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updateCheck(params){
        let query = 'update order_item_service set check_user_id = ${checkUserId}, ' +
            ' check_user_name = ${checkUserName} , status = 7 , check_perf = ssi.check_perf' +
            ' from order_item_service ois ' +
            ' left join ( select id,( case ' +
            ' when deploy_perf_type=2 then check_perf_fixed ' +
            ' when deploy_perf_type=3 then check_perf_fixed * check_perf_ratio ' +
            '  else 0 end ) as check_perf ' +
            ' from sale_service_info ' +
            ' where id is not null ' +
            ' ) as ssi on ssi.id = ois.sale_service_id' +
            ' where order_item_service.id = ${orderItemServiceId} RETURNING order_item_service.id ';
        let valueObj = {};
        valueObj.checkUserId = params.checkUserId;
        valueObj.checkUserName = params.checkUserName;
        valueObj.orderItemServiceId = params.orderItemServiceId;
        logger.debug(' updateDeployAndStatus ');
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
            ' and order_id = ${orderId}' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.orderItemServiceId =params.orderItemServiceId;
        valueObj.orderId =params.orderId;
        logger.debug(' deleteItemService ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = OrderItemServiceDAO;