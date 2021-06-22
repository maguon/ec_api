const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppDAO.js');

class AppDAO  {
    static async queryApp(params) {
        let query = "select * from app_info where id is not null ";
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
        query = query + '  order by id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryApp ');
        return await pgDb.any(query,filterObj);
    }

    static async queryAppCount(params) {
        let query = "select count(id) from app_info where id is not null ";
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
        logger.debug(' queryAppCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addApp(params) {
        const query = 'INSERT INTO app_info ( status , app_type , device_type , version , version_num , min_version_num , force_update , url , remarks) ' +
            'VALUES ( ${status} , ${appType} , ${deviceType} , ${version} , ${versionNum} , ${minVersionNum} , ' +
            '${forceUpdate} , ${url} , ${remarks} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.appType = params.appType;
        valueObj.deviceType = params.deviceType;
        valueObj.version = params.version;
        valueObj.versionNum = params.versionNum;
        valueObj.minVersionNum = params.minVersionNum;
        valueObj.forceUpdate = params.forceUpdate;
        valueObj.url = params.url;
        valueObj.remarks = params.remarks;
        logger.debug(' addApp ');
        return await pgDb.any(query,valueObj);
    }

    static async updateApp(params){
        const query = 'update app_info set app_type= ${appType} , device_type=${deviceType} , version=${version} , version_num=${versionNum} ,  min_version_num=${minVersionNum} , ' +
            ' force_update=${forceUpdate} ,  url=${url} , remarks=${remarks} ' +
            'where id =${appId} RETURNING id ';
        let valueObj = {};
        valueObj.appType = params.appType;
        valueObj.deviceType = params.deviceType;
        valueObj.version = params.version;
        valueObj.versionNum = params.versionNum;
        valueObj.minVersionNum = params.minVersionNum;
        valueObj.forceUpdate = params.forceUpdate;
        valueObj.url = params.url;
        valueObj.remarks = params.remarks;
        valueObj.appId = params.appId;
        logger.debug(' updateApp ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update app_info set status=${status} ' +
            ' where id =${appId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.appId = params.appId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteApp(params){
        const query = 'delete from app_info where id =${appId} RETURNING id ';
        let valueObj = {};
        valueObj.appId =params.appId;
        logger.debug(' deleteApp ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = AppDAO;