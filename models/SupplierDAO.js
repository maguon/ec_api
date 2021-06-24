const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SupplierDAO.js');

class SupplierDAO  {
    static async querySupplier(params) {
        let query = "select si.* , ui.real_name " +
            " from supplier_info si " +
            " left join user_info ui on ui.id = si.op_user " +
            " where si.id is not null ";
        let filterObj = {};
        if(params.supplierId){
            query += " and si.id = ${supplierId} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.status){
            query += " and si.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.supplierName){
            query += " and si.supplier_name like '%" + params.supplierName + "%' ";
        }
        if(params.supplierType){
            query += " and si.supplier_type = ${supplierType} ";
            filterObj.supplierType = params.supplierType;
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
        logger.debug(' querySupplier ');
        return await pgDb.any(query,filterObj);
    }

    static async querySupplierCount(params) {
        let query = "select count(id) from supplier_info where id is not null ";
        let filterObj = {};
        if(params.supplierId){
            query += " and id = ${id} ";
            filterObj.supplierId = params.supplierId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.opUser){
            query += " and op_user = ${opUser} ";
            filterObj.opUser = params.opUser;
        }
        if(params.supplierName){
            query += " and supplier_name like '%" + params.supplierName + "%' ";
        }
        if(params.supplierType){
            query += " and supplier_type = ${supplierType} ";
            filterObj.supplierType = params.supplierType;
        }
        logger.debug(' querySupplierCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addSupplier(params) {
        const query = 'INSERT INTO supplier_info (status , op_user , remark , supplier_name , supplier_type , ' +
            ' contact_name , email , tel , mobile , fax , address , invoice_title , invoice_bank , ' +
            ' invoice_bank_ser , invoice_address , settle_type , settle_month_day ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${supplierName} , ${supplierType} , ${contactName} ,' +
            ' ${email} , ${tel} , ${mobile} , ${fax} , ${address} , ${invoiceTitle} , ${invoiceBank} ,' +
            ' ${invoiceBankSer} , ${invoiceAddress} , ${settleType} , ${settleMonthDay} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.supplierName = params.supplierName;
        valueObj.supplierType = params.supplierType;
        valueObj.contactName = params.contactName;
        valueObj.email = params.email;
        valueObj.tel = params.tel;
        valueObj.mobile = params.mobile;
        valueObj.fax = params.fax;
        valueObj.address = params.address;
        valueObj.invoiceTitle = params.invoiceTitle;
        valueObj.invoiceBank = params.invoiceBank;
        valueObj.invoiceBankSer = params.invoiceBankSer;
        valueObj.invoiceAddress = params.invoiceAddress;
        valueObj.settleType = params.settleType;
        valueObj.settleMonthDay = params.settleMonthDay;
        logger.debug(' addSupplier ');
        return await pgDb.any(query,valueObj);
    }

    static async updateSupplier(params){
        const query = 'update supplier_info set op_user=${opUser} , remark=${remark} , ' +
            ' supplier_name=${supplierName} ,  supplier_type=${supplierType} , ' +
            ' contact_name=${contactName} , email=${email} , tel=${tel} , mobile=${mobile} ,' +
            ' fax=${fax} , address=${address} , invoice_title=${invoiceTitle} , ' +
            ' invoice_bank=${invoiceBank} , invoice_bank_ser=${invoiceBankSer} , ' +
            ' invoice_address=${invoiceAddress} , settle_type=${settleType} , settle_month_day=${settleMonthDay} ' +
            ' where id =${supplierId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.supplierName = params.supplierName;
        valueObj.supplierType = params.supplierType;
        valueObj.contactName =params.contactName;
        valueObj.email =params.email;
        valueObj.tel =params.tel;
        valueObj.mobile =params.mobile;
        valueObj.fax =params.fax;
        valueObj.address =params.address;
        valueObj.invoiceTitle =params.invoiceTitle;
        valueObj.invoiceBank =params.invoiceBank;
        valueObj.invoiceBankSer =params.invoiceBankSer;
        valueObj.invoiceAddress =params.invoiceAddress;
        valueObj.settleType =params.settleType;
        valueObj.settleMonthDay =params.settleMonthDay;
        valueObj.supplierId =params.supplierId;
        logger.debug(' updateSupplier ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update supplier_info set status=${status} , op_user=${opUser} ' +
            ' where id=${supplierId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.supplierId = params.supplierId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteSupplier(params){
        const query = 'delete from supplier_info where id =${supplierId} RETURNING id ';
        let valueObj = {};
        valueObj.supplierId =params.supplierId;
        logger.debug(' deleteSupplier ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = SupplierDAO;