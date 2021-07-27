const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StatisticsDAO.js');

class StatisticsDAO  {

    static async queryPurchaseStatByMonth(params) {
        let query = "select dateb.y_month, " +
            " COALESCE(sum(pi.transfer_cost),0) as transfer_cost, " +
            " COALESCE(sum(pi.product_cost),0) as product_cost, " +
            " COALESCE(sum(pi.total_cost),0) as total_cost , count(pi.id)  " +
            " from date_base dateb " +
            " left join purchase_info pi on pi.payment_date_id = dateb.id " +
            " where dateb.id is not null ";
        let filterObj = {};
        if(params.status){
            query += " and pi.status in (${status:csv})";
            filterObj.status = params.status.split(',');
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and pi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        query = query + " group by dateb.y_month ";
        query = query + ' order by dateb.y_month desc ';

        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }        logger.debug(' queryPurchaseStatByMonth ');
        return await pgDb.any(query,filterObj);
    }

    static async queryPurchaseStatByDay(params) {
        let query = "select dateb.id, " +
            " COALESCE(sum(pi.transfer_cost),0) as transfer_cost, " +
            " COALESCE(sum(pi.product_cost),0) as product_cost, " +
            " COALESCE(sum(pi.total_cost),0) as total_cost, count(pi.id) " +
            " from date_base dateb " +
            " left join purchase_info pi on pi.payment_date_id = dateb.id " +
            " where dateb.id is not null ";
        let filterObj = {};
        if(params.status){
            query += " and pi.status in (${status:csv})";
            filterObj.status = params.status.split(',');
        }
        if(params.storageStatus){
            query += " and pi.storage_status = ${storageStatus} ";
            filterObj.storageStatus = params.storageStatus;
        }
        if(params.paymentStatus){
            query += " and pi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        query = query + " group by dateb.id ";
        query = query + ' order by dateb.id desc ';

        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }

        logger.debug(' queryPurchaseStatByDays ');
        return await pgDb.any(query,filterObj);
    }

    static async queryClientStatByMonth(params) {
        let query = "select dateb.y_month, count(ci.id)  " +
            " from date_base dateb " +
            " left join client_info ci on ci.date_id = dateb.id   " +
            " where dateb.id is not null ";
        let filterObj = {};
        if(params.status){
            query += " and ci.status in (${status:csv})";
            filterObj.status = params.status.split(',');
        }
        if(params.sourceType){
            query += " and ci.source_type = ${sourceType} ";
            filterObj.sourceType = params.sourceType;
        }
        query = query + " group by dateb.y_month ";
        query = query + ' order by dateb.y_month desc ';

        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }        logger.debug(' queryClientStatByMonth ');
        return await pgDb.any(query,filterObj);
    }

    static async queryClientStatByDay(params) {
        let query = "select dateb.id, count(ci.id) " +
            " from date_base dateb " +
            " left join client_info ci on ci.date_id = dateb.id " +
            " where dateb.id is not null ";
        let filterObj = {};
        if(params.status){
            query += " and ci.status in (${status:csv})";
            filterObj.status = params.status.split(',');
        }
        if(params.sourceType){
            query += " and ci.source_type = ${sourceType} ";
            filterObj.sourceType = params.sourceType;
        }
        query = query + " group by dateb.id ";
        query = query + ' order by dateb.id desc ';

        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }

        logger.debug(' queryClientStatByDays ');
        return await pgDb.any(query,filterObj);
    }

    static async queryOrderStatByMonth(params) {
        let query = "select dateb.y_month, " +
            " COALESCE(sum(oi.service_price),0) as service_price, " +
            " COALESCE(sum(oi.prod_price),0) as prod_price, " +
            " COALESCE(sum(oi.discount_service_price),0) as discount_service_price , " +
            " COALESCE(sum(oi.discount_prod_price),0) as discount_prod_price, " +
            " COALESCE(sum(oi.total_discount_price),0) as total_discount_price, " +
            " COALESCE(sum(oi.actual_service_price),0) as actual_service_price , " +
            " COALESCE(sum(oi.actual_prod_price),0) as actual_prod_price, " +
            " COALESCE(sum(oi.total_actual_price),0) as total_actual_price, " +
            " COALESCE(sum(oi.transfer_price),0) as transfer_price , " +
            " count(oi.id) " +
            " from date_base dateb " +
            " left join order_info oi on oi.date_id = dateb.id     " +
            " where dateb.id is not null ";
        let filterObj = {};
        if(params.status){
            query += " and oi.status in (${status:csv})";
            filterObj.status = params.status.split(',');
        }
        if(params.paymentStatus){
            query += " and oi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.orderType){
            query += " and oi.order_type = ${orderType} ";
            filterObj.orderType = params.orderType;
        }
        query = query + " group by dateb.y_month ";
        query = query + ' order by dateb.y_month desc ';

        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }        logger.debug(' queryOrderStatByMonth ');
        return await pgDb.any(query,filterObj);
    }

    static async queryOrderStatByDay(params) {
        let query = "select dateb.id, " +
            " COALESCE(sum(oi.service_price),0) as service_price, " +
            " COALESCE(sum(oi.prod_price),0) as prod_price, " +
            " COALESCE(sum(oi.discount_service_price),0) as discount_service_price , " +
            " COALESCE(sum(oi.discount_prod_price),0) as discount_prod_price, " +
            " COALESCE(sum(oi.total_discount_price),0) as total_discount_price, " +
            " COALESCE(sum(oi.actual_service_price),0) as actual_service_price, " +
            " COALESCE(sum(oi.actual_prod_price),0) as actual_prod_price, " +
            " COALESCE(sum(oi.total_actual_price),0) as total_actual_price, " +
            " COALESCE(sum(oi.transfer_price),0) as transfer_price, " +
            " count(oi.id) " +
            " from date_base dateb " +
            " left join order_info oi on oi.date_id = dateb.id   " +
            " where dateb.id is not null ";
        let filterObj = {};
        if(params.status){
            query += " and oi.status in (${status:csv})";
            filterObj.status = params.status.split(',');
        }
        if(params.paymentStatus){
            query += " and oi.payment_status = ${paymentStatus} ";
            filterObj.paymentStatus = params.paymentStatus;
        }
        if(params.orderType){
            query += " and oi.order_type = ${orderType} ";
            filterObj.orderType = params.orderType;
        }
        query = query + " group by dateb.id ";
        query = query + ' order by dateb.id desc ';

        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }

        logger.debug(' queryOrderStatByDays ');
        return await pgDb.any(query,filterObj);
    }


}

module.exports = StatisticsDAO;