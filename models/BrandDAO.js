const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('BrandDAO.js');

class BrandDAO  {
    static async queryBrand(params) {
        let query = "select bi.*, ui.real_name from brand_info bi " +
            " left join user_info ui on ui.id = bi.op_user " +
            " where bi.id is not null  ";
        let filterObj = {};
        if(params.brandId){
            query += " and bi.id = ${brandId} ";
            filterObj.brandId = params.brandId;
        }
        if(params.status){
            query += " and bi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and bi.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.brandName){
            query += " and bi.brand_name like '%" + params.brandName + "%' ";
        }
        if(params.remark){
            query += " and bi.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by bi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryBrand ');
        return await pgDb.any(query,filterObj);
    }

    static async queryBrandCount(params) {
        let query = "select count(id) from brand_info where id is not null ";
        let filterObj = {};
        if(params.brandId){
            query += " and id = ${brandId} ";
            filterObj.brandId = params.brandId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.brandName){
            query += " and brand_name like '%" + params.brandName + "%' ";
        }
        if(params.remark){
            query += " and remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryBrandCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addBrand(params) {
        const query = 'INSERT INTO brand_info (op_user , remark , brand_name ) ' +
            ' VALUES ( ${opUser} , ${remark} , ${brandName}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.brandName = params.brandName;
        logger.debug(' addBrand ');
        return await pgDb.any(query,valueObj);
    }

    static async updateBrand(params){
        const query = 'update brand_info set op_user=${opUser} , remark=${remark} , brand_name=${brandName} ' +
            'where id =${brandId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.brandName = params.brandName;
        valueObj.brandId =params.brandId;
        logger.debug(' updateBrand ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update brand_info set status=${status} , op_user=${opUser} ' +
            ' where id =${brandId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.brandId = params.brandId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteBrand(params){
        const query = 'delete from brand_info where id =${brandId} RETURNING id ';
        let valueObj = {};
        valueObj.brandId =params.brandId;
        logger.debug(' deleteBrand ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = BrandDAO;