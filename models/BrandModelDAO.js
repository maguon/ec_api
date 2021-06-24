const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('BrandModelDAO.js');

class BrandModelDAO  {
    static async queryBrandModel(params) {
        let query = "select bmi.*,bi.brand_name,bi.status as brand_status" +
            " from brand_model_info bmi " +
            " left join brand_info bi " +
            " on bi.id = bmi.brand_id " +
            " where bmi.id is not null ";
        let filterObj = {};
        if(params.brandModelId){
            query += " and bmi.id = ${brandModelId} ";
            filterObj.brandModelId = params.brandModelId;
        }
        if(params.brandId){
            query += " and bmi.brand_id = ${brandId} ";
            filterObj.brandId = params.brandId;
        }
        if(params.status){
            query += " and bmi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and bmi.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.brandModelName){
            query += " and bmi.brand_model_name like '%" + params.brandModelName + "%' ";
        }
        if(params.remark){
            query += " and bmi.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by bmi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryBrandModel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryBrandModelCount(params) {
        let query = "select count(id) from brand_model_info where id is not null ";
        let filterObj = {};
        if(params.brandModelId){
            query += " and id = ${brandModelId} ";
            filterObj.brandModelId = params.brandModelId;
        }
        if(params.brandId){
            query += " and brand_id = ${brandId} ";
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
        logger.debug(' queryBrandModelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addBrandModel(params) {
        const query = 'INSERT INTO brand_model_info (status , op_user , remark , brand_model_name , brand_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${brandModelName} , ${brandId}) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.brandModelName = params.brandModelName;
        valueObj.brandId = params.brandId;
        logger.debug(' addBrandModel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateBrandModel(params){
        const query = 'update brand_model_info set op_user=${opUser} , remark=${remark} , ' +
            ' brand_model_name=${brandModelName} , brand_id=${brandId} ' +
            ' where id =${brandModelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.brandModelName = params.brandModelName;
        valueObj.brandId =params.brandId;
        valueObj.brandModelId =params.brandModelId;
        logger.debug(' updateBrandModel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update brand_model_info set status=${status} , op_user=${opUser} ' +
            ' where id =${brandModelId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.brandModelId = params.brandModelId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteBrandModel(params){
        const query = 'delete from brand_model_info where id =${brandModelId} RETURNING id ';
        let valueObj = {};
        valueObj.brandModelId =params.brandModelId;
        logger.debug(' deleteBrandModel ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = BrandModelDAO;