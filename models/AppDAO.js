const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppDAO.js');

class AppDAO  {
    static async queryApp(params) {
        let query = "select * from app_version where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.appType){
            query += " and app_type = ${appType} ";
            filterObj.appType = params.appType;
        }
        if(params.deviceType){
            query += " and device_type = ${deviceType} ";
            filterObj.deviceType = params.deviceType;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
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
        logger.debug(' queryApp ');
        return await pgDb.any(query,filterObj);
    }

    static async queryAppCount(params) {
        let query = "select count(id) from app_version where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.appType){
            query += " and app_type = ${appType} ";
            filterObj.appType = params.appType;
        }
        if(params.deviceType){
            query += " and device_type = ${deviceType} ";
            filterObj.deviceType = params.deviceType;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryAppCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addApp(params) {
        const query = 'INSERT INTO app_version (app_type , device_type , version_ser , version_num , min_version_num , force_up_flag , url , remarks , status) ' +
            'VALUES (${appType} , ${deviceType} , ${versionSer} , ${versionNum} , ${minVersionNum} , ' +
            '${forceUpFlag} , ${url} , ${remarks} , ${status}) RETURNING id ';
        let valueObj = {};
        valueObj.appType = params.appType;
        valueObj.deviceType = params.deviceType;
        valueObj.versionSer = params.versionSer;
        valueObj.versionNum = params.versionNum;
        valueObj.minVersionNum = params.minVersionNum;
        valueObj.forceUpFlag = params.forceUpFlag;
        valueObj.url = params.url;
        valueObj.remarks = params.remarks;
        valueObj.status = params.status;
        logger.debug(' addApp ');
        return await pgDb.one(query,valueObj);
    }

    static async updateApp(params){
        const query = 'update app_version set app_type= ${appType} , device_type=${deviceType} , version_ser=${versionSer} , version_num=${versionNum} ,  min_version_num=${minVersionNum} , ' +
            ' force_up_flag=${forceUpFlag} ,  url=${url} , remarks=${remarks} , updated_on=${updated_on}' +
            'where id =${appId} RETURNING * ';
        let valueObj = {};
        valueObj.appType = params.appType;
        valueObj.deviceType = params.deviceType;
        valueObj.versionSer = params.versionSer;
        valueObj.versionNum = params.versionNum;
        valueObj.minVersionNum = params.minVersionNum;
        valueObj.forceUpFlag = params.forceUpFlag;
        valueObj.url = params.url;
        valueObj.remarks = params.remarks;
        valueObj.updated_on = params.updated_on;
        valueObj.appId =params.appId;
        logger.debug(' updateApp ');
        return await pgDb.one(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update app_version set status=${status} , updated_on=${updated_on}' +
            ' where id =${appId} RETURNING * ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.updated_on = params.updated_on;
        valueObj.appId =params.appId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteApp(params){
        const query = 'delete from app_version where id =${appId} RETURNING id ';
        let valueObj = {};
        valueObj.appId =params.appId;
        logger.debug(' deleteApp ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = AppDAO;