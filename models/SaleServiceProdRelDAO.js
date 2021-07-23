const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SaleServiceProdRelDAO.js');

class SaleServiceProdRelDAO  {
    static async querySaleServiceProdRel(params) {
        let query = "select sspr.* , ui.real_name , pi.price , pi.unit_name " +
            " from sale_service_prod_rel sspr " +
            " left join user_info ui on ui.id = sspr.op_user " +
            " left join product_info pi on pi.id = sspr.product_id " +
            " where sale_service_id is not null";
        let filterObj = {};
        if(params.saleServiceId){
            query += " and sspr.sale_service_id = ${saleServiceId} ";
            filterObj.saleServiceId = params.saleServiceId;
        }
        if(params.productId){
            query += " and sspr.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' querySaleServiceProdRel ');
        return await pgDb.any(query,filterObj);
    }

    static async querySaleServiceProdRelCount(params) {
        let query = "select count(*) from sale_service_prod_rel " +
            " where sale_service_id is not null";
        let filterObj = {};
        if(params.saleServiceId){
            query += " and sale_service_id = ${saleServiceId} ";
            filterObj.saleServiceId = params.saleServiceId;
        }
        if(params.productId){
            query += " and product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        logger.debug(' querySaleServiceProdRelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addSaleServiceProdRel(params) {
        const query = 'INSERT INTO sale_service_prod_rel ( op_user , sale_service_id , service_name , ' +
            ' product_id , product_name , product_count ) ' +
            ' VALUES (${opUser} , ${saleServiceId} , ${serviceName} , ' +
            ' ${productId} , ${productName} , ${productCount} ) ' +
            ' RETURNING sale_service_id,product_id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.saleServiceId = params.saleServiceId;
        valueObj.serviceName = params.serviceName;
        valueObj.productId = params.productId;
        valueObj.productName = params.productName;
        valueObj.productCount = params.productCount;
        logger.debug(' addSaleServiceProdRel ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteSaleServiceProdRel(params){
        const query = 'delete from sale_service_prod_rel ' +
            ' where sale_service_id =${saleServiceId} AND product_id =${productId} ' +
            ' RETURNING sale_service_id,product_id ';
        let valueObj = {};
        valueObj.saleServiceId =params.saleServiceId;
        valueObj.productId =params.productId;
        logger.debug(' deleteSaleServiceProdRel ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = SaleServiceProdRelDAO;