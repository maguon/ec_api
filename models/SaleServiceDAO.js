const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SaleServiceDAO.js');

class SaleServiceDAO  {
    static async querySaleService(params) {
        let query = "select ssi.* , ui.real_name " +
            " from sale_service_info ssi " +
            " left join user_info ui on ui.id = ssi.op_user " +
            " where ssi.id is not null ";
        let filterObj = {};
        if(params.saleServiceId){
            query += " and ssi.id = ${saleServiceId} ";
            filterObj.saleServiceId = params.saleServiceId;
        }
        if(params.status){
            query += " and ssi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.serviceType){
            query += " and ssi.service_type = ${serviceType} ";
            filterObj.serviceType = params.serviceType;
        }
        if(params.servicePriceType){
            query += " and ssi.service_price_type = ${servicePriceType} ";
            filterObj.servicePriceType = params.servicePriceType;
        }
        if(params.serviceCostType){
            query += " and ssi.service_cost_type = ${serviceCostType} ";
            filterObj.serviceCostType = params.serviceCostType;
        }
        if(params.salePerfType){
            query += " and ssi.sale_perf_type = ${salePerfType} ";
            filterObj.salePerfType = params.salePerfType;
        }
        if(params.deployPerfType){
            query += " and ssi.deploy_perf_type = ${deployPerfType} ";
            filterObj.deployPerfType = params.deployPerfType;
        }
        if(params.checkPerfType){
            query += " and ssi.check_perf_type = ${checkPerfType} ";
            filterObj.checkPerfType = params.checkPerfType;
        }
        query = query + '  order by ssi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' querySaleService ');
        return await pgDb.any(query,filterObj);
    }

    static async querySaleServiceCount(params) {
        let query = "select count(id) from sale_service_info where id is not null ";
        let filterObj = {};
        if(params.saleServiceId){
            query += " and id = ${saleServiceId} ";
            filterObj.saleServiceId = params.saleServiceId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.serviceType){
            query += " and service_type = ${serviceType} ";
            filterObj.serviceType = params.serviceType;
        }
        if(params.servicePriceType){
            query += " and service_price_type = ${servicePriceType} ";
            filterObj.servicePriceType = params.servicePriceType;
        }
        if(params.serviceCostType){
            query += " and service_cost_type = ${serviceCostType} ";
            filterObj.serviceCostType = params.serviceCostType;
        }
        if(params.salePerfType){
            query += " and sale_perf_type = ${salePerfType} ";
            filterObj.salePerfType = params.salePerfType;
        }
        if(params.deployPerfType){
            query += " and deploy_perf_type = ${deployPerfType} ";
            filterObj.deployPerfType = params.deployPerfType;
        }
        if(params.checkPerfType){
            query += " and check_perf_type = ${checkPerfType} ";
            filterObj.checkPerfType = params.checkPerfType;
        }
        logger.debug(' querySaleServiceCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addSaleService(params) {
        const query = 'INSERT INTO sale_service_info (status , op_user , remark , service_name , service_type , ' +
            ' service_price_type , fixed_price , unit_price , service_price_count , ' +
            ' service_cost_type , fixed_cost , unit_cost , service_cost_count , ' +
            ' total_price , total_cost , total_profit , sale_perf_type , sale_perf_fixed , sale_perf_ratio , ' +
            ' deploy_perf_type , deploy_perf_fixed , deploy_perf_ratio , check_perf_type , check_perf_fixed , check_perf_ratio ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${serviceName} , ${serviceType} , ' +
            ' ${servicePriceType} , ${fixedPrice} , ${unitPrice} , ${servicePriceCount} , ' +
            ' ${serviceCostType} , ${fixedCost} , ${unitCost} , ${serviceCostCount} , ' +
            ' ${totalPrice} , ${totalCost} , ${totalProfit} , ${salePerfType} , ${salePerfFixed} , ${salePerfRatio} , ' +
            ' ${deployPerfType} , ${deployPerfFixed} , ${deployPerfRatio} , ${checkPerfType} , ${checkPerfFixed} , ${checkPerfRatio} ) ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.serviceName = params.serviceName;
        valueObj.serviceType = params.serviceType;
        valueObj.servicePriceType = params.servicePriceType;
        valueObj.fixedPrice = params.fixedPrice;
        valueObj.unitPrice = params.unitPrice;
        valueObj.servicePriceCount = params.servicePriceCount;
        valueObj.serviceCostType = params.serviceCostType;
        valueObj.fixedCost = params.fixedCost;
        valueObj.unitCost = params.unitCost;
        valueObj.serviceCostCount = params.serviceCostCount;
        valueObj.totalPrice = params.totalPrice;
        valueObj.totalCost = params.totalCost;
        valueObj.totalProfit = params.totalProfit;
        valueObj.salePerfType = params.salePerfType;
        valueObj.salePerfFixed = params.salePerfFixed;
        valueObj.salePerfRatio = params.salePerfRatio;
        valueObj.deployPerfType = params.deployPerfType;
        valueObj.deployPerfFixed = params.deployPerfFixed;
        valueObj.deployPerfRatio = params.deployPerfRatio;
        valueObj.checkPerfType = params.checkPerfType;
        valueObj.checkPerfFixed = params.checkPerfFixed;
        valueObj.checkPerfRatio = params.checkPerfRatio;
        logger.debug(' addSaleService ');
        return await pgDb.any(query,valueObj);
    }

    static async updateSaleService(params){
        const query = 'update sale_service_info set op_user=${opUser} , remark=${remark} , ' +
            ' service_name=${serviceName} ,  service_type=${serviceType} , ' +
            ' service_price_type=${servicePriceType} , fixed_price=${fixedPrice} , unit_price=${unitPrice} , service_price_count=${servicePriceCount} ,' +
            ' service_cost_type=${serviceCostType} , fixed_cost=${fixedCost} , unit_cost=${unitCost} , service_cost_count=${serviceCostCount} ,' +
            ' total_price=${totalPrice} , total_cost=${totalCost} , total_profit=${totalProfit} , ' +
            ' sale_perf_type=${salePerfType} , sale_perf_fixed=${salePerfFixed} , sale_perf_ratio=${salePerfRatio} , ' +
            ' deploy_perf_type=${deployPerfType} , deploy_perf_fixed=${deployPerfFixed} , deploy_perf_ratio=${deployPerfRatio} , ' +
            ' check_perf_type=${checkPerfType} , check_perf_fixed=${checkPerfFixed} , check_perf_ratio=${checkPerfRatio} ' +
            ' where id =${saleServiceId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.serviceName = params.serviceName;
        valueObj.serviceType = params.serviceType;

        valueObj.servicePriceType = params.servicePriceType;
        valueObj.fixedPrice = params.fixedPrice;
        valueObj.unitPrice = params.unitPrice;
        valueObj.servicePriceCount = params.servicePriceCount;

        valueObj.serviceCostType = params.serviceCostType;
        valueObj.fixedCost = params.fixedCost;
        valueObj.unitCost = params.unitCost;
        valueObj.serviceCostCount = params.serviceCostCount;

        valueObj.totalPrice = params.totalPrice;
        valueObj.totalCost = params.totalCost;
        valueObj.totalProfit = params.totalProfit;

        valueObj.salePerfType = params.salePerfType;
        valueObj.salePerfFixed = params.salePerfFixed;
        valueObj.salePerfRatio = params.salePerfRatio;

        valueObj.deployPerfType = params.deployPerfType;
        valueObj.deployPerfFixed = params.deployPerfFixed;
        valueObj.deployPerfRatio = params.deployPerfRatio;

        valueObj.checkPerfType = params.checkPerfType;
        valueObj.checkPerfFixed = params.checkPerfFixed;
        valueObj.checkPerfRatio = params.checkPerfRatio;

        valueObj.saleServiceId =params.saleServiceId;
        logger.debug(' updateSaleService ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = SaleServiceDAO;