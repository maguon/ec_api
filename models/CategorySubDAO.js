const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CategorySubDAO.js');

class CategorySubDAO  {
    static async queryCategorySub(params) {
        let query = " select csi.* ,ci.category_name , ci.status as category_status " +
            " from category_sub_info csi " +
            " left join category_info ci " +
            " on ci.id = csi.category_id " +
            " where csi.id is not null ";
        let filterObj = {};
        if(params.categorySubId){
            query += " and csi.id = ${categorySubId} ";
            filterObj.categorySubId = params.categorySubId;
        }
        if(params.categoryId){
            query += " and csi.category_id = ${categoryId} ";
            filterObj.categoryId = params.categoryId;
        }
        if(params.status){
            query += " and csi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and csi.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.categorySubName){
            query += " and csi.category_Sub_name like '%" + params.categorySubName + "%' ";
        }
        if(params.remark){
            query += " and csi.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by csi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryCategorySub ');
        return await pgDb.any(query,filterObj);
    }

    static async queryCategorySubCount(params) {
        let query = "select count(id) from category_sub_info where id is not null ";
        let filterObj = {};
        if(params.categorySubId){
            query += " and id = ${categorySubId} ";
            filterObj.categorySubId = params.categorySubId;
        }
        if(params.categoryId){
            query += " and category_id = ${categoryId} ";
            filterObj.categoryId = params.categoryId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.categorySubName){
            query += " and category_sub_name like '%" + params.categorySubName + "%' ";
        }
        if(params.remark){
            query += " and remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryCategorySubCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addCategorySub(params) {
        const query = 'INSERT INTO category_sub_info (status , op_user , remark , category_sub_name , category_id) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${categorySubName} , ${categoryId}) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.categorySubName = params.categorySubName;
        valueObj.categoryId = params.categoryId;
        logger.debug(' addCategorySub ');
        return await pgDb.any(query,valueObj);
    }

    static async updateCategorySub(params){
        const query = 'update category_sub_info set op_user=${opUser} , remark=${remark} ,' +
            ' category_sub_name=${categorySubName} , category_id=${categoryId}' +
            ' where id =${categorySubId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.categorySubName = params.categorySubName;
        valueObj.categoryId =params.categoryId;
        valueObj.categorySubId =params.categorySubId;
        logger.debug(' updateCategorySub ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update category_sub_info set status=${status} , op_user=${opUser} ' +
            ' where id =${categorySubId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.categorySubId = params.categorySubId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteCategorySub(params){
        const query = 'delete from category_sub_info where id =${categorySubId} RETURNING id ';
        let valueObj = {};
        valueObj.categorySubId =params.categorySubId;
        logger.debug(' deleteCategorySub ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = CategorySubDAO;