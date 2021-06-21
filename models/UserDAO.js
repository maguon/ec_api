const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDAO.js');

class UserDAO  {
    static async queryUser(params) {
        let query = "select id, created_on, updated_on, status, user_name, phone, gender, type from user_info where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.userName){
            query += " and user_name like  '%" + params.userName + "%' ";
        }
        if(params.password){
            query += " and password = ${password} ";
            filterObj.password = params.password;
        }
        if(params.phone){
            query += " and phone = ${phone} ";
            filterObj.phone = params.phone;
        }
        if(params.gender){
            query += " and gender = ${gender} ";
            filterObj.gender = params.gender;
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
        logger.debug(' queryUser ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUserCount(params) {
        let query = "select count(id) from user_info where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.userName){
            query += " and user_name like  '%" + params.userName + "%' ";
        }
        if(params.password){
            query += " and password = ${password} ";
            filterObj.password = params.password;
        }
        if(params.phone){
            query += " and phone = ${phone} ";
            filterObj.phone = params.phone;
        }
        if(params.gender){
            query += " and gender = ${gender} ";
            filterObj.gender = params.gender;
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
        logger.debug(' queryUserCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addUser(params) {
        const query = 'INSERT INTO user_info (status , user_name , password , phone , gender , type) ' +
            'VALUES (${status} , ${userName} , ${password} , ${phone} , ${gender} , ' +
            '${type} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.userName = params.userName;
        valueObj.password = params.password;
        valueObj.phone = params.phone;
        valueObj.gender = params.gender;
        valueObj.type = params.type;
        logger.debug(' addUser ');
        return await pgDb.one(query,valueObj);
    }

    static async updateUser(params){
        const query = 'update user_info set user_name= ${userName} , password=${password} , phone=${phone} , gender=${gender} ,  type=${type} ' +
            'where id =${userId} RETURNING * ';
        let valueObj = {};
        valueObj.userName = params.userName;
        valueObj.password = params.password;
        valueObj.phone = params.phone;
        valueObj.gender = params.gender;
        valueObj.type = params.type;
        valueObj.userId =params.userId;
        logger.debug(' updateUser ');
        return await pgDb.one(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update user_info set status=${status} , updated_on=${updated_on}' +
            ' where id =${userId} RETURNING * ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.updated_on = params.updated_on;
        valueObj.userId = params.userId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteUser(params){
        const query = 'delete from user_info where id =${userId} RETURNING id ';
        let valueObj = {};
        valueObj.userId =params.userId;
        logger.debug(' deleteUser ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = UserDAO;