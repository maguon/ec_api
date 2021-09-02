const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProdMatchModelDAO.js');

class ProdMatchModelDAO  {
    static async queryProdMatchModel(params) {
        let query = "select pmm.*, pmb.brand_name, pmb.status as match_brand_status ,ui.real_name" +
            " from prod_match_model pmm " +
            " left join prod_match_brand pmb on pmb.id = pmm.match_brand_id " +
            " left join user_info ui on ui.id = pmm.op_user " +
            " where pmm.id is not null ";
        let filterObj = {};
        if(params.prodMatchModelId){
            query += " and pmm.id = ${prodMatchModelId} ";
            filterObj.prodMatchModelId = params.prodMatchModelId;
        }
        if(params.matchBrandId){
            query += " and pmm.match_brand_id = ${matchBrandId} ";
            filterObj.matchBrandId = params.matchBrandId;
        }
        if(params.status){
            query += " and pmm.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and pmm.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.matchModelName){
            query += " and pmm.match_model_name like '%" + params.matchModelName + "%' ";
        }
        if(params.remark){
            query += " and pmm.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by pmm.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryProdMatchModel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryProdMatchModelCount(params) {
        let query = "select count(pmm.id) from prod_match_model pmm where pmm.id is not null ";
        let filterObj = {};
        if(params.prodMatchModelId){
            query += " and pmm.id = ${prodMatchModelId} ";
            filterObj.prodMatchModelId = params.prodMatchModelId;
        }
        if(params.matchBrandId){
            query += " and pmm.match_brand_id = ${matchBrandId} ";
            filterObj.matchBrandId = params.matchBrandId;
        }
        if(params.status){
            query += " and pmm.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and pmm.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.matchModelName){
            query += " and pmm.match_model_name like '%" + params.matchModelName + "%' ";
        }
        if(params.remark){
            query += " and pmm.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryProdMatchModelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addProdMatchModel(params) {
        const query = 'INSERT INTO prod_match_model ( op_user , remark , match_model_name , match_brand_id ) ' +
            ' VALUES (${opUser} , ${remark} , ${matchModelName} , ${matchBrandId}) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.matchModelName = params.matchModelName;
        valueObj.matchBrandId = params.matchBrandId;
        logger.debug(' addProdMatchModel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateProdMatchModel(params){
        const query = 'update prod_match_model set op_user=${opUser} , remark=${remark} , ' +
            ' match_model_name=${matchModelName} , match_brand_id=${matchBrandId} ' +
            ' where id =${prodMatchModelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.matchModelName = params.matchModelName;
        valueObj.matchBrandId =params.matchBrandId;
        valueObj.prodMatchModelId =params.prodMatchModelId;
        logger.debug(' updateProdMatchModel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update prod_match_model set status=${status} , op_user=${opUser} ' +
            ' where id =${prodMatchModelId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.prodMatchModelId = params.prodMatchModelId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteProdMatchModel(params){
        const query = 'delete from prod_match_model where id =${prodMatchModelId} RETURNING id ';
        let valueObj = {};
        valueObj.prodMatchModelId =params.prodMatchModelId;
        logger.debug(' deleteProdMatchModelId ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = ProdMatchModelDAO;