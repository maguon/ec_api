const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PurchaseItemUniqueRelDAO.js');

class PurchaseItemUniqueRelDAO  {
    static async queryUniqueRel(params) {
        let query = "select piur.* , ui.real_name " +
            " from purchase_item_unique_rel piur " +
            " left join user_info ui on ui.id = piur.op_user " +
            " where piur.id is not null ";
        let filterObj = {};
        if(params.uniqueRelId){
            query += " and piur.id = ${uniqueRelId} ";
            filterObj.uniqueRelId = params.uniqueRelId;
        }
        if(params.status){
            query += " and piur.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.purchaseId){
            query += " and piur.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and piur.purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.productId){
            query += " and piur.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.productName){
            query += " and piur.product_name like '%" + params.productName + "%' ";
        }
        if(params.uniqueId){
            query += " and piur.unique_id like '%" + params.uniqueId + "%' ";
        }
        query = query + '  order by piur.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryUniqueRel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryUniqueRelCount(params) {
        let query = "select count(piur.id) from purchase_item_unique_rel piur where piur.id is not null ";
        let filterObj = {};
        if(params.uniqueRelId){
            query += " and piur.id = ${uniqueRelId} ";
            filterObj.uniqueRelId = params.uniqueRelId;
        }
        if(params.status){
            query += " and piur.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.purchaseId){
            query += " and piur.purchase_id = ${purchaseId} ";
            filterObj.purchaseId = params.purchaseId;
        }
        if(params.purchaseItemId){
            query += " and piur.purchase_item_id = ${purchaseItemId} ";
            filterObj.purchaseItemId = params.purchaseItemId;
        }
        if(params.productId){
            query += " and piur.product_id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.productName){
            query += " and piur.product_name like '%" + params.productName + "%' ";
        }
        if(params.uniqueId){
            query += " and piur.unique_id like '%" + params.uniqueId + "%' ";
        }
        logger.debug(' queryUniqueRelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addUniqueRel(params) {
        const query = 'INSERT INTO purchase_item_unique_rel ( op_user, remark, purchase_id, ' +
            ' purchase_item_id, product_id, product_name, unique_id ) ' +
            ' VALUES ( ${opUser} , ${remark} , ${purchaseId} , ${purchaseItemId} , ${productId} ,' +
            ' ${productName} , ${uniqueId} ) RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.purchaseId = params.purchaseId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.productId = params.productId;
        valueObj.productName = params.productName;
        valueObj.uniqueId = params.uniqueId;
        logger.debug(' addUniqueRel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update purchase_item_unique_rel set status = 1 , op_user=${opUser} ' +
            ' where id in (${uniqueRelIdArray:csv}) and status = 0 RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.uniqueRelIdArray = params.uniqueRelIdArray.join(',').split(',');
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteUniqueRel(params){
        const query = 'delete from purchase_item_unique_rel ' +
            ' where id =${uniqueRelId} ' +
            ' and status = 0 ' +
            ' and purchase_item_id =${purchaseItemId} ' +
            ' and product_id =${productId}' +
            ' RETURNING id ';
        let valueObj = {};
        valueObj.uniqueRelId = params.uniqueRelId;
        valueObj.purchaseItemId = params.purchaseItemId;
        valueObj.productId = params.productId;
        logger.debug(' deleteUniqueRel ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = PurchaseItemUniqueRelDAO;