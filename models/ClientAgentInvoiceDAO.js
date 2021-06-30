const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ClientAgentInvoiceDAO.js');

class ClientAgentInvoiceDAO  {
    static async queryClientAgentInvoice(params) {
        let query = "select cai.* , ui.real_name " +
            " from client_agent_invoice cai " +
            " left join user_info ui on ui.id = cai.op_user " +
            " where cai.id is not null ";
        let filterObj = {};
        if(params.clientAgentInvoiceId){
            query += " and cai.id = ${clientAgentInvoiceId} ";
            filterObj.clientAgentInvoiceId = params.clientAgentInvoiceId;
        }
        if(params.status){
            query += " and cai.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.clientAgentId){
            query += " and cai.client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.invoiceType){
            query += " and cai.invoice_type = ${invoiceType} ";
            filterObj.invoiceType = params.invoiceType;
        }
        if(params.settleType){
            query += " and cai.settle_type = ${settleType} ";
            filterObj.settleType = params.settleType;
        }
        query = query + '  order by cai.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryClientAgentInvoice ');
        return await pgDb.any(query,filterObj);
    }

    static async queryClientAgentInvoiceCount(params) {
        let query = "select count(id) from client_agent_invoice where id is not null ";
        let filterObj = {};
        if(params.clientAgentInvoiceId){
            query += " and id = ${clientAgentInvoiceId} ";
            filterObj.clientAgentInvoiceId = params.clientAgentInvoiceId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.clientAgentId){
            query += " and client_agent_id = ${clientAgentId} ";
            filterObj.clientAgentId = params.clientAgentId;
        }
        if(params.invoiceType){
            query += " and invoice_type = ${invoiceType} ";
            filterObj.invoiceType = params.invoiceType;
        }
        if(params.settleType){
            query += " and settle_type = ${settleType} ";
            filterObj.settleType = params.settleType;
        }
        logger.debug(' queryClientAgentInvoiceCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addClientAgentInvoice(params) {
        const query = 'INSERT INTO client_agent_invoice (status , op_user , remark , client_agent_id , invoice_type , ' +
            ' invoice_title , invoice_bank , invoice_bank_ser , invoice_address , settle_type ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${clientAgentId} , ${invoiceType} , ${invoiceTitle} ,' +
            ' ${invoiceBank} , ${invoiceBankSer} , ${invoiceAddress} , ${settleType} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.clientAgentId = params.clientAgentId;
        valueObj.invoiceType = params.invoiceType;
        valueObj.invoiceTitle = params.invoiceTitle;
        valueObj.invoiceBank = params.invoiceBank;
        valueObj.invoiceBankSer = params.invoiceBankSer;
        valueObj.invoiceAddress = params.invoiceAddress;
        valueObj.settleType = params.settleType;
        logger.debug(' addClientAgentInvoice ');
        return await pgDb.any(query,valueObj);
    }

    static async updateClientAgentInvoice(params){
        const query = 'update client_agent_invoice set op_user = ${opUser} , remark = ${remark} , ' +
            ' invoice_type = ${invoiceType} , invoice_title = ${invoiceTitle} , invoice_bank = ${invoiceBank} , ' +
            ' invoice_bank_ser = ${invoiceBankSer} , invoice_address = ${invoiceAddress} , settle_type = ${settleType}' +
            ' where id =${clientAgentInvoiceId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.invoiceType = params.invoiceType;
        valueObj.invoiceTitle = params.invoiceTitle;
        valueObj.invoiceBank = params.invoiceBank;
        valueObj.invoiceBankSer = params.invoiceBankSer;
        valueObj.invoiceAddress = params.invoiceAddress;
        valueObj.settleType = params.settleType;
        valueObj.clientAgentInvoiceId = params.clientAgentInvoiceId;
        logger.debug(' updateClientAgentInvoice ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = ClientAgentInvoiceDAO;