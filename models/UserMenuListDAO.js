const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserMenuListDAO.js');

class UserMenuListDAO  {
    static async queryUserMenuList(params) {
        let query = "select * from user_menu_list where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.type){
            query += " and type = ${type} ";
            filterObj.type = params.type;
        }
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        query = query + '  order by id desc ';
        logger.debug(' queryUserMenuList ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUserMenuListCount(params) {
        let query = "select count(id) from user_menu_list where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.type){
            query += " and type = ${type} ";
            filterObj.type = params.type;
        }
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryUserMenuListCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addUserMenuList(params) {
        const query = 'INSERT INTO user_menu_list (type , menu_list) ' +
            'VALUES (${type} , ${menu_list} ) RETURNING id ';
        let valueObj = {};
        valueObj.type = params.type;
        valueObj.menu_list = JSON.stringify(params.menu_list);
        logger.debug(' addUserMenuList ');
        return await pgDb.one(query,valueObj);
    }
}

module.exports = UserMenuListDAO;