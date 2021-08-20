const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserTypeMenuDAO.js');

class UserTypeMenuDAO  {

    static async queryUserTypeList(params) {
        let query = "SELECT id,type_name, status , remarks " +
            " FROM user_type_menu " +
            " where id is not null ";
        let filterObj = {};
        if(params.typeId){
            query += " and id = ${typeId} ";
            filterObj.typeId = params.typeId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
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
        logger.debug(' queryUserTypeList ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUserTypeListCount(params) {
        let query = "select count(id) from user_type_menu where id is not null ";
        let filterObj = {};
        if(params.typeId){
            query += " and id = ${typeId} ";
            filterObj.typeId = params.typeId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        logger.debug(' queryUserTypeListCount ');
        return await pgDb.one(query,filterObj);
    }

    static async queryUserTypeMenu(params) {
        let query = "select * from user_type_menu where id is not null ";
        let filterObj = {};
        if(params.typeId){
            query += " and id = ${typeId} ";
            filterObj.typeId = params.typeId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
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
        logger.debug(' queryUserTypeMenu ');
        return await pgDb.any(query,filterObj);
    }

    static async addUserTypeMenu(params) {
        const query = 'INSERT INTO user_type_menu ( status , type_name , menu_list , remarks ) ' +
            'VALUES ( ${status} , ${typeName} , ${menuList} , ${remarks} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.typeName = params.typeName;
        valueObj.menuList = JSON.stringify(params.menuList);
        valueObj.remarks = params.remarks;
        logger.debug(' addUserTypeMenu ');
        return await pgDb.any(query,valueObj);
    }

    static async updateUserTypeMenu(params){
        const query = 'update user_type_menu set status= ${status} , type_name=${typeName} , menu_list=${menuList} , remarks=${remarks} ' +
            'where id =${id} RETURNING * ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.typeName = params.typeName;
        valueObj.menuList = JSON.stringify(params.menuList);
        valueObj.remarks = params.remarks;
        valueObj.id =params.id;
        logger.debug(' updateUserTypeMenu ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update user_type_menu set status=${status}' +
            ' where id =${typeId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.typeId = params.typeId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteUserTypeMenu(params){
        const query = 'delete from user_type_menu where id =${typeId} RETURNING id ';
        let valueObj = {};
        valueObj.typeId =params.typeId;
        logger.debug(' deleteUserTypeMenu ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = UserTypeMenuDAO;