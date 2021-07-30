const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ClientDAO.js');

class ClientDAO  {
    static async queryClient(params) {
        let query = "select ci.* , ui.real_name , rui.real_name as refer_real_name , " +
            " ca.name as client_agent_name " +
            " from client_info ci " +
            " left join user_info ui on ui.id = ci.op_user " +
            " left join user_info rui on rui.id = ci.refer_user " +
            " left join client_agent ca on ca.id = ci.client_agent_id " +
            " where ci.id is not null ";
        let filterObj = {};
        if(params.clientId){
            query += " and ci.id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and ci.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.status){
            query += " and ci.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.tel){
            query += " and ci.tel like '%" + params.tel + "%' ";
        }
        if(params.clientSerial){
            query += " and ci.client_serial like '%" + params.clientSerial + "%' ";
        }
        if(params.clientSerialDetail){
            query += " and ci.client_serial_detail like '%" + params.clientSerialDetail + "%' ";
        }
        if(params.dateIdStart){
            query += " and ci.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and ci.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.referUser){
            query += " and ci.refer_user = ${referUser} ";
            filterObj.referUser = params.referUser;
        }
        if(params.sourceType){
            query += " and ci.source_type = ${sourceType} ";
            filterObj.sourceType = params.sourceType;
        }
        query = query + '  order by ci.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryClient ');
        return await pgDb.any(query,filterObj);
    }

    static async queryClientCount(params) {
        let query = "select count(id) from client_info ci where ci.id is not null ";
        let filterObj = {};
        if(params.clientId){
            query += " and ci.id = ${clientId} ";
            filterObj.clientId = params.clientId;
        }
        if(params.clientAgentId){
            query += " and ci.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.status){
            query += " and ci.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.tel){
            query += " and ci.tel like '%" + params.tel + "%' ";
        }
        if(params.clientSerial){
            query += " and ci.client_serial like '%" + params.clientSerial + "%' ";
        }
        if(params.clientSerialDetail){
            query += " and ci.client_serial_detail like '%" + params.clientSerialDetail + "%' ";
        }
        if(params.dateIdStart){
            query += " and ci.date_id >= ${dateIdStart} ";
            filterObj.dateIdStart = params.dateIdStart;
        }
        if(params.dateIdEnd){
            query += " and ci.date_id <= ${dateIdEnd} ";
            filterObj.dateIdEnd = params.dateIdEnd;
        }
        if(params.referUser){
            query += " and ci.refer_user = ${referUser} ";
            filterObj.referUser = params.referUser;
        }
        if(params.sourceType){
            query += " and ci.source_type = ${sourceType} ";
            filterObj.sourceType = params.sourceType;
        }
        logger.debug(' queryClientCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addClient(params) {
        const query = 'INSERT INTO client_info (op_user , remark , name , tel , ' +
            ' address , client_serial , client_serial_detail , model_id , model_name ,' +
            ' client_agent_id , date_id , refer_user , source_type ) ' +
            ' VALUES ( ${opUser} , ${remark} ,  ${name} , ${tel} , ${address} ,' +
            ' ${clientSerial} , ${clientSerialDetail} , ${modelId} , ${modelName} , ' +
            ' ${clientAgentId} , ${dateId} , ${referUser} , ${sourceType} ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.name = params.name;
        valueObj.tel = params.tel;
        valueObj.address = params.address;
        valueObj.clientSerial = params.clientSerial;
        valueObj.clientSerialDetail = params.clientSerialDetail;
        valueObj.modelId = params.modelId;
        valueObj.modelName = params.modelName;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.dateId = params.dateId;
        if(params.referUser){
            valueObj.referUser = params.referUser;
        }else{
            valueObj.referUser = 1;
        }
        valueObj.sourceType = params.sourceType;
        logger.debug(' addClient ');
        return await pgDb.any(query,valueObj);
    }

    static async updateClient(params){
        const query = 'update client_info set op_user = ${opUser} , remark = ${remark} , ' +
            ' name = ${name} , tel = ${tel} , address = ${address} , ' +
            ' client_serial = ${clientSerial} , client_serial_detail = ${clientSerialDetail} , ' +
            ' model_id = ${modelId} , model_name = ${modelName} , client_agent_id = ${clientAgentId}' +
            ' where id =${clientId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.name = params.name;
        valueObj.tel = params.tel;
        valueObj.address = params.address;
        valueObj.clientSerial = params.clientSerial;
        valueObj.clientSerialDetail = params.clientSerialDetail;
        valueObj.modelId = params.modelId;
        valueObj.modelName = params.modelName;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.clientId = params.clientId;
        logger.debug(' updateClient ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update client_info set status=${status} , op_user=${opUser} ' +
            ' where id=${clientId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.clientId = params.clientId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = ClientDAO;