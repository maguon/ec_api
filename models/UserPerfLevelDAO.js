const pgDb = require('../db/connections/PgConnection');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserPerfLevelDAO.js');

class UserPerfLevelDAO  {
    static async queryUserPerfLevel(params) {
        let query = "select upl.* " +
            " from user_perf_level upl " +
            " where upl.id is not null ";
        let filterObj = {};
        if(params.userPerfLevelId){
            query += " and upl.id = ${userPerfLevelId} ";
            filterObj.userPerfLevelId = params.userPerfLevelId;
        }
        if(params.status){
            query += " and upl.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.perfName){
            query += " and upl.perf_name like  '%" + params.perfName + "%' ";
        }
        if(params.remark){
            query += " and upl.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        if(params.saleRatio){
            query += " and upl.sale_ratio = ${saleRatio} ";
            filterObj.saleRatio = params.saleRatio;
        }
        if(params.deployRatio){
            query += " and upl.deploy_ratio = ${deployRatio} ";
            filterObj.deployRatio = params.deployRatio;
        }
        if(params.checkRatio){
            query += " and upl.check_ratio = ${checkRatio} ";
            filterObj.checkRatio = params.checkRatio;
        }
        query = query + '  order by upl.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryUserPerfLevel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUserPerfLevelCount(params) {
        let query = "select count(upl.id) " +
            " from user_perf_level upl " +
            " where upl.id is not null ";
        let filterObj = {};
        if(params.userPerfLevelId){
            query += " and upl.id = ${userPerfLevelId} ";
            filterObj.userPerfLevelId = params.userPerfLevelId;
        }
        if(params.status){
            query += " and upl.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.perfName){
            query += " and upl.perf_name like  '%" + params.perfName + "%' ";
        }
        if(params.remark){
            query += " and upl.remark = ${remark} ";
            filterObj.remark = params.remark;
        }
        if(params.saleRatio){
            query += " and upl.sale_ratio = ${saleRatio} ";
            filterObj.saleRatio = params.saleRatio;
        }
        if(params.deployRatio){
            query += " and upl.deploy_ratio = ${deployRatio} ";
            filterObj.deployRatio = params.deployRatio;
        }
        if(params.checkRatio){
            query += " and upl.check_ratio = ${checkRatio} ";
            filterObj.checkRatio = params.checkRatio;
        }
        logger.debug(' queryUserPerfLevelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addUserPerfLevel(params) {
        const query = 'INSERT INTO user_perf_level (perf_name, remark, sale_ratio, deploy_ratio, check_ratio) ' +
            ' VALUES (${perfName} , ${remark} , ${saleRatio} , ${deployRatio} , ${checkRatio} ) ' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.perfName = params.perfName;
        valueObj.remark = params.remark;
        valueObj.saleRatio = params.saleRatio;
        valueObj.deployRatio = params.deployRatio;
        valueObj.checkRatio = params.checkRatio;
        logger.debug(' addUserPerfLevel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateUserPerfLevel(params){
        const query = 'update user_perf_level set perf_name= ${perfName} , remark=${remark} , ' +
            ' sale_ratio=${saleRatio} , deploy_ratio=${deployRatio} ,  check_ratio=${checkRatio} ' +
            ' where id =${userPerfLevelId} RETURNING id ';
        let valueObj = {};
        valueObj.perfName = params.perfName;
        valueObj.remark = params.remark;
        valueObj.saleRatio = params.saleRatio;
        valueObj.deployRatio = params.deployRatio;
        valueObj.checkRatio = params.checkRatio;
        valueObj.userPerfLevelId =params.userPerfLevelId;
        logger.debug(' updateUserPerfLevel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update user_perf_level set status=${status} ' +
            ' where id =${userPerfLevelId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.userPerfLevelId = params.userPerfLevelId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = UserPerfLevelDAO;