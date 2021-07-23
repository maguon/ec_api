const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderProdServiceDAO.js');

class OrderItemProdDAO  {
    static async queryItemProd(params) {
        let query = "select oip.* , ui.real_name " +
            " from order_item_prod oip " +
            " left join user_info ui on ui.id = oip.op_user " +
            " where oip.id is not null ";
        let filterObj = {};
        if(params.orderItemProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderItemProdId = params.orderItemProdId;
        }
        if(params.status){
            query += " and oip.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and oip.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.orderId){
            query += " and oip.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and oip.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oip.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.orderItemType){
            query += " and oip.order_item_type = ${orderItemType} ";
            filterObj.orderItemType = params.orderItemType;
        }
        if(params.prodId){
            query += " and oip.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.dateStart){
            query += " and oip.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and oip.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        query = query + '  order by OiP.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryItemProd ');
        return await pgDb.any(query,filterObj);
    }

    static async queryItemProdCount(params) {
        let query = "select count(oip.id) from order_item_prod oip where oip.id is not null ";
        let filterObj = {};
        if(params.orderItemProdId){
            query += " and oip.id = ${orderItemProdId} ";
            filterObj.orderItemProdId = params.orderItemProdId;
        }
        if(params.status){
            query += " and oip.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.saleUserId){
            query += " and oip.sale_user_id = ${saleUserId} ";
            filterObj.saleUserId = params.saleUserId;
        }
        if(params.orderId){
            query += " and oip.order_id = ${orderId} ";
            filterObj.orderId = params.orderId;
        }
        if(params.clientId){
            query += " and oip.client_id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and oip.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.orderItemType){
            query += " and oip.order_item_type = ${orderItemType} ";
            filterObj.orderItemType = params.orderItemType;
        }
        if(params.prodId){
            query += " and oip.prod_id = ${prodId} ";
            filterObj.prodId = params.prodId;
        }
        if(params.dateStart){
            query += " and oip.date_id >= ${dateStart} ";
            filterObj.dateStart = params.dateStart;
        }
        if(params.dateEnd){
            query += " and oip.date_id <= ${dateEnd} ";
            filterObj.dateEnd = params.dateEnd;
        }
        logger.debug(' queryItemProdCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addItemProd(params) {
        const query = ' INSERT INTO order_item_prod( op_user, sale_user_id, sale_user_name, remark, ' +
            ' order_id, client_id, client_agent_id, order_item_type, ' +
            ' prod_id, prod_name, unit_price, prod_count, prod_price, ' +
            ' discount_prod_price, actual_prod_price, date_id) ' +
            ' ( select ${opUser} , ${saleUserId} , ${saleUserName} , ${remark} , ' +
            ' ${orderId} , ${clientId} , ${clientAgentId} , ${orderItemType} , ' +
            ' pi.id , pi.product_name , pi.price , COALESCE(sspl.product_count,0) , COALESCE(pi.price,0)*COALESCE(sspl.product_count,0), ' +
            ' ${discountProdPrice} , COALESCE(pi.price,0)*COALESCE(sspl.product_count,0)-${discountProdPrice} , ${dateId} ' +
            ' from product_info pi' +
            ' left join sale_service_prod_rel sspl on sspl.product_id = pi.id ' +
            ' where pi.id is not null and pi.id = ${productId})  ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.saleUserId = params.saleUserId;
        valueObj.saleUserName = params.saleUserName;
        valueObj.remark = params.remark;
        valueObj.orderId = params.orderId;
        valueObj.clientId = params.clientId;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.orderItemType = params.orderItemType;
        valueObj.discountProdPrice = params.discountProdPrice;
        valueObj.discountProdPrice = params.discountProdPrice;
        valueObj.dateId = params.dateId;
        valueObj.productId = params.prodId;
        logger.debug(' addItemProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateItemProd(params){
        let query = 'update order_item_prod ' +
            ' set op_user=${opUser} , remark = ${remark} ' ;
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;

        if(params.prodCount){
            query = query + ', prod_count = ${prodCount} , prod_price =  unit_price * ${prodCount} ' ;
            valueObj.prodCount = params.prodCount;
            valueObj.prodCount = params.prodCount;
        }

        if(params.discountProdPrice){
            query = query + ' , discount_prod_price = ${discountProdPrice} ';
            valueObj.discountProdPrice = params.discountProdPrice;

            if(params.prodCount){
                query = query + ' , actual_prod_price =  unit_price * ${prodCount} - ${discountProdPrice} ' ;
                valueObj.prodCount = params.prodCount;
                valueObj.discountProdPrice = params.discountProdPrice;
            }else{
                query = query + ' , actual_prod_price =  prod_price - ${discountProdPrice} ' ;
                valueObj.discountProdPrice = params.discountProdPrice;
            }
        }

        query = query +  ' where id=${orderItemProdId} RETURNING id ';
        valueObj.orderItemProdId = params.orderItemProdId;
        logger.debug(' updateItemProd ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update order_item_prod set status=${status} , op_user=${opUser} ' +
            ' where id=${orderItemProdId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.orderItemProdId = params.orderItemProdId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = OrderItemProdDAO;