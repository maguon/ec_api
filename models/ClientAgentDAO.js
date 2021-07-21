const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ClientAgentDAO.js');

class ClientAgentDAO  {
    static async queryClientAgent(params) {
        let query = "select ca.* , ui.real_name , sui.real_name as sales_real_name " +
            " from client_agent ca " +
            " left join user_info ui on ui.id = ca.op_user " +
            " left join user_info sui on sui.id = ca.sales_user_id " +
            " where ca.id is not null ";
        let filterObj = {};
        if(params.clientAgentId){
            query += " and ca.id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.status){
            query += " and ca.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.clientType){
            query += " and ca.client_type = ${clientType} ";
            filterObj.clientType = params.clientType;
        }
        if(params.idSerial){
            query += " and ca.id_serial = ${idSerial} ";
            filterObj.idSerial = params.idSerial;
        }
        if(params.dateIdStart){
            query += " and ca.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and ca.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.sourceType){
            query += " and ca.source_type = ${sourceType} ";
            filterObj.sourceType = params.sourceType;
        }
        query = query + '  order by ca.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryClientAgent ');
        return await pgDb.any(query,filterObj);
    }

    static async queryClientAgentCount(params) {
        let query = "select count(id) from client_agent where id is not null ";
        let filterObj = {};
        if(params.clientAgentId){
            query += " and id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.clientType){
            query += " and client_type = ${clientType} ";
            filterObj.clientType = params.clientType;
        }
        if(params.idSerial){
            query += " and id_serial = ${idSerial} ";
            filterObj.idSerial = params.idSerial;
        }
        if(params.dateIdStart){
            query += " and date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.sourceType){
            query += " and source_type = ${sourceType} ";
            filterObj.sourceType = params.sourceType;
        }
        logger.debug(' queryClientAgentCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addClientAgent(params) {
        const query = 'INSERT INTO client_agent (status , op_user , remark , name , client_type , tel , ' +
            ' address , id_serial , date_id , sales_user_id , source_type ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} ,  ${name} , ${clientType} , ${tel} , ${address} ,' +
            ' ${idSerial} , ${dateId} , ${salesUserId} , ${sourceType} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.name = params.name;
        valueObj.clientType = params.clientType;
        valueObj.tel = params.tel;
        valueObj.address = params.address;
        valueObj.idSerial = params.idSerial;
        valueObj.dateId = params.dateId;
        valueObj.salesUserId = params.salesUserId;
        valueObj.sourceType = params.sourceType;
        logger.debug(' addClientAgent ');
        return await pgDb.any(query,valueObj);
    }

    static async updateClientAgent(params){
        const query = 'update client_agent set op_user = ${opUser} , remark = ${remark} , ' +
            ' name = ${name} , client_type = ${clientType} , tel = ${tel} , address = ${address} , ' +
            ' id_serial = ${idSerial} , sales_user_id = ${salesUserId} , source_type = ${sourceType}' +
            ' where id =${clientAgentId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.name = params.name;
        valueObj.clientType = params.clientType;
        valueObj.tel = params.tel;
        valueObj.address = params.address;
        valueObj.idSerial = params.idSerial;
        valueObj.salesUserId = params.salesUserId;
        valueObj.sourceType = params.sourceType;
        valueObj.clientAgentId = params.clientAgentId;
        logger.debug(' updateClientAgent ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update client_agent set status=${status} , op_user=${opUser} ' +
            ' where id=${clientAgentId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.clientAgentId = params.clientAgentId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = ClientAgentDAO;