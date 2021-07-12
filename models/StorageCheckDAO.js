const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageCheckDAO.js');

class StorageCheckDAO  {
    static async queryStorageCheck(params) {
        let query = "select sc.* ,ui.real_name from storage_check sc " +
            " left join user_info ui on ui.id = sc.op_user " +
            " where sc.id is not null ";
        let filterObj = {};
        if(params.storageCheckId){
            query += " and sc.id = ${storageCheckId} ";
            filterObj.storageCheckId = params.storageCheckId;
        }
        if(params.status){
            query += " and sc.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.checkStatus){
            query += " and sc.check_status = ${checkStatus} ";
            filterObj.checkStatus = params.checkStatus;
        }
        if(params.dateIdStart){
            query += " and sc.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and sc.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        query = query + '  order by sc.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryStorageCheck ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageCheckCount(params) {
        let query = "select count(id) from storage_check where id is not null ";
        let filterObj = {};
        if(params.storageCheckId){
            query += " and id = ${storageCheckId} ";
            filterObj.storageCheckId = params.storageCheckId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.checkStatus){
            query += " and check_status = ${checkStatus} ";
            filterObj.checkStatus = params.checkStatus;
        }
        if(params.dateIdStart){
            query += " and date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        logger.debug(' queryStorageCheckCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageCheck(params) {
        const query = 'INSERT INTO storage_check ( op_user , ' +
            ' remark , date_id , check_desc ) ' +
            ' VALUES (${opUser} , ${remark} , ${dateId} ,  ${checkDesc} ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.dateId = params.dateId;
        valueObj.checkDesc = params.checkDesc;
        logger.debug(' addStorageCheck ');
        return await pgDb.any(query,valueObj);
    }

    static async updatePlanCheckCount(params){
        const query = 'update storage_check set plan_check_count=${planCheckCount} ' +
            ' where id =${storageCheckId} RETURNING id ';
        let valueObj = {};
        valueObj.planCheckCount = params.planCheckCount;
        valueObj.storageCheckId =params.storageCheckId;
        logger.debug(' updatePlanCheckCount ');
        return await pgDb.any(query,valueObj);
    }

    static async updateCheckedCount(params){
        const query = 'update storage_check set checked_count = ( ' +
            ' select count(*) ' +
            ' from storage_check_rel scr ' +
            ' where scr.storage_check_id = ${storageCheckId} and scr.status = 2 )' +
            ' where id =${storageCheckId} RETURNING id ';
        let valueObj = {};
        valueObj.storageCheckId = params.storageCheckId;
        valueObj.storageCheckId =params.storageCheckId;
        logger.debug(' updateCheckedCount ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageCheck(params){
        const query = 'update storage_check set op_user=${opUser} , remark=${remark} ' +
            ' where id =${storageCheckId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageCheckId =params.storageCheckId;
        logger.debug(' updateStorageCheck ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update storage_check set status=${status} , op_user=${opUser} , date_id=${dateId} ' +
            ' where id =${storageCheckId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.dateId = params.dateId;
        valueObj.storageCheckId = params.storageCheckId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async updateCheckStatus(params){
        const query = 'update storage_check set check_status = ( ' +
            ' select (case when count(*)>=1 then 2 else 1 end ) as check_status ' +
            ' from storage_check_rel scr ' +
            ' where scr.storage_check_id = ${storageCheckId} ' +
            ' and scr.check_status = 2 ) ' +
            ' where id =${storageCheckId} RETURNING id ';
        let valueObj = {};
        valueObj.storageCheckId = params.storageCheckId;
        valueObj.storageCheckId = params.storageCheckId;
        logger.debug(' updateCheckStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async queryStatistics(params) {
        let query = "select count(*) , COALESCE(sum(sc.plan_check_count),0) as plan_check_count , " +
            " COALESCE(sum(sc.checked_count),0) as checked_count " +
            " from storage_check sc " +
            " where sc.id is not null";
        let filterObj = {};
        if(params.status){
            query += " and sc.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.checkStatus){
            query += " and sc.check_status = ${checkStatus} ";
            filterObj.checkStatus = params.checkStatus;
        }
        if(params.dateIdStart){
            query += " and sc.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and sc.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        logger.debug(' queryStatistics ');
        return await pgDb.any(query,filterObj);
    }

}

module.exports = StorageCheckDAO;