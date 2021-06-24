const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CategoryDAO.js');

class CategoryDAO  {
    static async queryCategory(params) {
        let query = "select * from category_info where id is not null ";
        let filterObj = {};
        if(params.categoryId){
            query += " and id = ${categoryId} ";
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
        if(params.categoryName){
            query += " and category_name like '%" + params.categoryName + "%' ";
        }
        if(params.remark){
            query += " and remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryCategory ');
        return await pgDb.any(query,filterObj);
    }

    static async queryCategoryCount(params) {
        let query = "select count(id) from category_info where id is not null ";
        let filterObj = {};
        if(params.categoryId){
            query += " and id = ${categoryId} ";
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
        if(params.categoryName){
            query += " and category_name like '%" + params.categoryName + "%' ";
        }
        if(params.remark){
            query += " and remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryCategoryCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addCategory(params) {
        const query = 'INSERT INTO category_info (status , op_user , remark , category_name ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${categoryName} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.categoryName = params.categoryName;
        logger.debug(' addCategory ');
        return await pgDb.any(query,valueObj);
    }

    static async updateCategory(params){
        const query = 'update category_info set op_user=${opUser} , remark=${remark} , ' +
            ' category_name=${categoryName} ' +
            ' where id =${categoryId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.categoryName = params.categoryName;
        valueObj.categoryId =params.categoryId;
        logger.debug(' updateCategory ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update category_info set status=${status} , op_user=${opUser} ' +
            ' where id =${categoryId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.categoryId = params.categoryId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteCategory(params){
        const query = 'delete from category_info where id =${categoryId} RETURNING id ';
        let valueObj = {};
        valueObj.categoryId =params.categoryId;
        logger.debug(' deleteCategory ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = CategoryDAO;