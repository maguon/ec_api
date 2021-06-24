const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageAreaDAO.js');

class StorageAreaDAO  {
    static async queryStorageArea(params) {
        let query = "select sai.*,si.storage_name,si.status as storage_status ,ui.real_name" +
            " from storage_area_info sai " +
            " left join storage_info si on si.id = sai.storage_id " +
            " left join user_info ui on ui.id = sai.op_user " +
            " where sai.id is not null  ";
        let filterObj = {};
        if(params.storageAreaId){
            query += " and sai.id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.storageId){
            query += " and sai.storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.status){
            query += " and sai.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and sai.op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.storageAreaName){
            query += " and sai.storage_area_name like '%" + params.storageAreaName + "%' ";
        }
        if(params.remark){
            query += " and sai.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        query = query + '  order by sai.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryStorageArea ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageAreaCount(params) {
        let query = "select count(id) from storage_area_info where id is not null ";
        let filterObj = {};
        if(params.storageAreaId){
            query += " and id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.storageId){
            query += " and storage_id = ${storageId} ";
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
        if(params.storageAreaName){
            query += " and storage_area_name like '%" + params.storageAreaName + "%' ";
        }
        if(params.remark){
            query += " and remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        logger.debug(' queryStorageAreaCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageArea(params) {
        const query = 'INSERT INTO storage_area_info (status , op_user , remark , storage_area_name , storage_id ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${storageAreaName} , ${storageId}) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageAreaName = params.storageAreaName;
        valueObj.storageId = params.storageId;
        logger.debug(' addStorageArea ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageArea(params){
        const query = 'update storage_area_info set op_user=${opUser} , remark=${remark} , ' +
            ' storage_area_name=${storageAreaName} , storage_id=${storageId} ' +
            ' where id =${storageAreaId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageAreaName = params.storageAreaName;
        valueObj.storageId = params.storageId;
        valueObj.storageAreaId =params.storageAreaId;
        logger.debug(' updateStorageArea ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update storage_area_info set status=${status} , op_user=${opUser} ' +
            ' where id =${storageAreaId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.storageAreaId = params.storageAreaId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteStorageArea(params){
        const query = 'delete from storage_area_info where id =${storageAreaId} RETURNING id ';
        let valueObj = {};
        valueObj.storageAreaId =params.storageAreaId;
        logger.debug(' deleteStorageArea ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = StorageAreaDAO;