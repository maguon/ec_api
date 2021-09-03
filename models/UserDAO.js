const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDAO.js');

class UserDAO  {
    static async queryUser(params) {
        let query = "select ui.id, ui.created_on, ui.updated_on, ui.status, ui.user_name, " +
            " ui.real_name, ui.phone, ui.email,  ui.gender, ui.type, utm.type_name, " +
            " utm.status as type_status, utm.remarks " +
            " from user_info ui " +
            " left join user_type_menu utm " +
            " on utm.id = ui.type " +
            " where ui.id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and ui.id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.status){
            query += " and ui.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.realName){
            query += " and ui.real_name like  '%" + params.realName + "%' ";
        }
        if(params.password){
            query += " and ui.password = ${password} ";
            filterObj.password = params.password;
        }
        if(params.phone){
            query += " and ui.phone like  '%" + params.phone + "%' ";
        }
        if(params.gender){
            query += " and ui.gender = ${gender} ";
            filterObj.gender = params.gender;
        }
        if(params.type){
            query += " and ui.type = ${type} ";
            filterObj.type = params.type;
        }
        query = query + '  order by ui.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryUser ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUserSysInfo(params) {
        let query = "select ui.id, ui.created_on, ui.updated_on, ui.status, ui.user_name, " +
            " ui.real_name, ui.phone, ui.email,  ui.gender, ui.type, utm.type_name, " +
            " utm.menu_list, utm.status as type_status, utm.remarks " +
            " from user_info ui " +
            " left join user_type_menu utm " +
            " on utm.id = ui.type " +
            " where ui.id is not null ";
        let filterObj = {};
        if(params.userId){
            query += " and ui.id = ${userId} ";
            filterObj.userId = params.userId;
        }
        logger.debug(' queryUserSysInfo ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUserCount(params) {
        let query = "select count(ui.id) " +
            " from user_info ui " +
            " left join user_type_menu utm " +
            " on utm.id = ui.type " +
            " where ui.id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and ui.id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.status){
            query += " and ui.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.realName){
            query += " and ui.real_name like  '%" + params.realName + "%' ";
        }
        if(params.password){
            query += " and ui.password = ${password} ";
            filterObj.password = params.password;
        }
        if(params.phone){
            query += " and ui.phone like  '%" + params.phone + "%' ";
        }
        if(params.gender){
            query += " and ui.gender = ${gender} ";
            filterObj.gender = params.gender;
        }
        if(params.type){
            query += " and ui.type = ${type} ";
            filterObj.type = params.type;
        }
        logger.debug(' queryUserCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addUser(params) {
        const query = 'INSERT INTO user_info (status , user_name , real_name , password , phone , email , gender , type , perf_level_id) ' +
            ' VALUES (${status} , ${userName} , ${realName} , ${password} , ${phone} , ${email} , ${gender} , ${type} ,${perfLevelId}) ' +
            ' on conflict(phone) DO NOTHING RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.userName = params.userName;
        valueObj.realName = params.realName;
        valueObj.password = params.password;
        valueObj.phone = params.phone;
        valueObj.email = params.email;
        valueObj.gender = params.gender;
        valueObj.type = params.type;
        valueObj.perfLevelId = params.perfLevelId;
        logger.debug(' addUser ');
        return await pgDb.any(query,valueObj);
    }

    static async updateUser(params){
        const query = 'update user_info set user_name= ${userName} , real_name=${realName} , ' +
            ' email=${email} , gender=${gender} , type=${type} , perf_level_id=${perfLevelId}' +
            ' where id =${userId} RETURNING id ';
        let valueObj = {};
        valueObj.userName = params.userName;
        valueObj.realName = params.realName;
        valueObj.email = params.email;
        valueObj.gender = params.gender;
        valueObj.type = params.type;
        valueObj.perfLevelId = params.perfLevelId;
        valueObj.userId =params.userId;
        logger.debug(' updateUser ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePassword(params){
        const query = 'update user_info set password= ${password} ' +
            'where id =${userId} RETURNING id ';
        let valueObj = {};
        valueObj.password = params.password;
        valueObj.userId =params.userId;
        logger.debug(' updatePassword ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePhone(params){
        const query = 'update user_info set phone= ${phone} ' +
            'where id =${userId} RETURNING id ';
        let valueObj = {};
        valueObj.phone = params.phone;
        valueObj.userId =params.userId;
        logger.debug(' updatePhone ');
        return await pgDb.any(query,valueObj);
    }

    static async updateType(params){
        const query = 'update user_info set type= ${type} ' +
            'where id =${userId} RETURNING id ';
        let valueObj = {};
        valueObj.type = params.type;
        valueObj.userId = params.userId;
        logger.debug(' updateType ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update user_info set status=${status} ' +
            ' where id =${userId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.userId = params.userId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = UserDAO;