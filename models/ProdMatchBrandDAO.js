const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProdMathBrandDAO.js');

class ProdMathBrandDAO  {
    static async queryProdMathBrand(params) {
        let query = "select pmb.*, ui.real_name from prod_match_brand pmb " +
            " left join user_info ui on ui.id = pmb.op_user " +
            " where pmb.id is not null  ";
        let filterObj = {};
        if(params.prodMatchBrandId){
            query += " and pmb.id = ${prodMatchBrandId} ";
            filterObj.prodMatchBrandId = params.prodMatchBrandId;
        }
        if(params.status){
            query += " and pmb.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and pmb.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.brandName){
            query += " and pmb.brand_name like '%" + params.brandName + "%' ";
        }
        if(params.remark){
            query += " and pmb.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by pmb.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryProdMathBrand ');
        return await pgDb.any(query,filterObj);
    }

    static async queryProdMathBrandCount(params) {
        let query = "select count(pmb.id) from prod_match_brand pmb where pmb.id is not null ";
        let filterObj = {};
        if(params.prodMatchBrandId){
            query += " and pmb.id = ${prodMatchBrandId} ";
            filterObj.prodMatchBrandId = params.prodMatchBrandId;
        }
        if(params.status){
            query += " and pmb.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and pmb.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.brandName){
            query += " and pmb.brand_name like '%" + params.brandName + "%' ";
        }
        if(params.remark){
            query += " and pmb.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryProdMathBrandCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addProdMathBrand(params) {
        const query = 'INSERT INTO prod_match_brand (op_user , remark , brand_name ) ' +
            ' VALUES ( ${opUser} , ${remark} , ${brandName}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.brandName = params.brandName;
        logger.debug(' addProdMathBrand ');
        return await pgDb.any(query,valueObj);
    }

    static async updateProdMathBrand(params){
        const query = 'update prod_match_brand set op_user=${opUser} , remark=${remark} , brand_name=${brandName} ' +
            'where id =${prodMatchBrandId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.brandName = params.brandName;
        valueObj.prodMatchBrandId =params.prodMatchBrandId;
        logger.debug(' updateProdMathBrand ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update prod_match_brand set status=${status} , op_user=${opUser} ' +
            ' where id =${prodMatchBrandId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.prodMatchBrandId = params.prodMatchBrandId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteProdMathBrand(params){
        const query = 'delete from prod_match_brand where id =${prodMatchBrandId} RETURNING id ';
        let valueObj = {};
        valueObj.prodMatchBrandId =params.prodMatchBrandId;
        logger.debug(' deleteProdMathBrand ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = ProdMathBrandDAO;