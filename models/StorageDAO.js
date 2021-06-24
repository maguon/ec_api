const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageDAO.js');

class StorageDAO  {
    static async queryStorage(params) {
        let query = "select si.* ,ui.real_name from storage_info si " +
            " left join user_info ui on ui.id = si.op_user " +
            " where si.id is not null ";
        let filterObj = {};
        if(params.storageId){
            query += " and si.id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.status){
            query += " and si.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and si.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.storageName){
            query += " and si.storage_name like '%" + params.storageName + "%' ";
        }
        if(params.remark){
            query += " and si.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by si.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryStorage ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageCount(params) {
        let query = "select count(id) from storage_info where id is not null ";
        let filterObj = {};
        if(params.storageId){
            query += " and id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.storageName){
            query += " and storage_name like '%" + params.storageName + "%' ";
        }
        if(params.remark){
            query += " and remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryStorageCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorage(params) {
        const query = 'INSERT INTO storage_info (status , op_user , remark , storage_name ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${storageName} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageName = params.storageName;
        logger.debug(' addStorage ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorage(params){
        const query = 'update storage_info set op_user=${opUser} , remark=${remark} , ' +
            ' storage_name=${storageName} ' +
            ' where id =${storageId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageName = params.storageName;
        valueObj.storageId =params.storageId;
        logger.debug(' updateStorage ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update storage_info set status=${status} , op_user=${opUser} ' +
            ' where id =${storageId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.storageId = params.storageId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteStorage(params){
        const query = 'delete from storage_info where id =${storageId} RETURNING id ';
        let valueObj = {};
        valueObj.storageId =params.storageId;
        logger.debug(' deleteStorage ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = StorageDAO;