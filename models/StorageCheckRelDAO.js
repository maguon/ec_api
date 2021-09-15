const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('StorageCheckRelDAO.js');

class StorageCheckRelDAO  {
    static async queryStorageCheckRel(params) {
        let query = "select sc.* ,ui.real_name , si.storage_name , sai.storage_area_name , pi.product_name , pi.product_s_name  " +
            " from storage_check_rel sc " +
            " left join user_info ui on ui.id = sc.op_user " +
            " left join storage_info si on si.id = sc.storage_id " +
            " left join storage_area_info sai on sai.id = sc.storage_area_id " +
            " left join product_info pi on pi.id = sc.product_id" +
            " where sc.id is not null ";
        let filterObj = {};
        if(params.storageCheckRelId){
            query += " and sc.id = ${storageCheckRelId} ";
            filterObj.storageCheckRelId = params.storageCheckRelId;
        }
        if(params.storageCheckId){
            query += " and sc.storage_check_id = ${storageCheckId} ";
            filterObj.storageCheckId = params.storageCheckId;
        }
        if(params.storageId){
            query += " and sc.storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and sc.storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.productId){
            query += " and sc.product_id = ${productId} ";
            filterObj.productId = params.productId;
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
        if(params.oldFlag){
            query += " and sc.old_flag = ${oldFlag} ";
            filterObj.oldFlag = params.oldFlag;
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
        logger.debug(' queryStorageCheckRel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryStorageCheckRelCount(params) {
        let query = "select count(id) from storage_check_rel where id is not null ";
        let filterObj = {};
        if(params.storageCheckRelId){
            query += " and id = ${storageCheckRelId} ";
            filterObj.storageCheckRelId = params.storageCheckRelId;
        }
        if(params.storageCheckId){
            query += " and storage_check_id = ${storageCheckId} ";
            filterObj.storageCheckId = params.storageCheckId;
        }
        if(params.storageId){
            query += " and storage_id = ${storageId} ";
            filterObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and storage_area_id = ${storageAreaId} ";
            filterObj.storageAreaId = params.storageAreaId;
        }
        if(params.productId){
            query += " and product_id = ${productId} ";
            filterObj.productId = params.productId;
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
        if(params.oldFlag){
            query += " and sc.old_flag = ${oldFlag} ";
            filterObj.oldFlag = params.oldFlag;
        }
        logger.debug(' queryStorageRelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addStorageCheckRel(params) {
        let query = 'INSERT INTO storage_check_rel ( check_status , op_user , ' +
            ' remark , storage_check_id , date_id , storage_count , check_count , storage_product_rel_id ,' +
            ' storage_id , storage_area_id , product_id , old_flag  ) ' +
            ' VALUES ( ${checkStatus}  , ${opUser} , ${remark} , ${storageCheckId} , ${dateId} ,  ' +
            ' ${storageCount} , ${checkCount} , ${storageProductRelId} , ${storageId} , ${storageAreaId} , ' +
            ' ${productId} , ${oldFlag} ) ';
        let valueObj = {};
        valueObj.checkStatus = params.checkStatus;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.storageCheckId = params.storageCheckId;
        valueObj.dateId = params.dateId;
        valueObj.storageCount = params.storageCount;
        valueObj.checkCount = params.checkCount;
        valueObj.storageProductRelId = params.storageProductRelId;
        valueObj.storageId = params.storageId;
        valueObj.storageAreaId = params.storageAreaId;
        valueObj.productId = params.productId;
        valueObj.oldFlag = params.oldFlag;
        query += " RETURNING id ";
        logger.debug(' addStorageCheckRel ');
        return await pgDb.any(query,valueObj);
    }

    //根据 storage_product_rel 新建 rel
    static async addStorageCheckRelByProductRel(params) {
        let query = 'INSERT INTO storage_check_rel (op_user , ' +
            ' storage_check_id , date_id , storage_count , check_count , storage_product_rel_id ,' +
            ' storage_id , storage_area_id , product_id , old_flag , prod_unique_arr , unique_flag ) ' +
            ' (select ${opUser} , ${storageCheckId} , ${dateId} , spr.storage_count , 0 , spr.id , ' +
            ' spr.storage_id , spr.storage_area_id , spr.product_id , spr.old_flag , ' +
            ' spr.prod_unique_arr , spr.unique_flag ' +
            ' from storage_product_rel spr ' +
            ' left join product_info pi on pi.id = spr.product_id ' +
            ' where spr.id is not null ';

        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.storageCheckId = params.storageCheckId;
        valueObj.dateId = params.dateId;
        if(params.storageId){
            query += " and spr.storage_id = ${storageId} ";
            valueObj.storageId = params.storageId;
        }
        if(params.storageAreaId){
            query += " and spr.storage_area_id = ${storageAreaId} ";
            valueObj.storageAreaId = params.storageAreaId;
        }
        if(params.categoryId){
            query += " and pi.category_id = ${categoryId} ";
            valueObj.categoryId = params.categoryId;
        }
        if(params.categorySubId){
            query += " and pi.category_sub_id = ${categorySubId} ";
            valueObj.categorySubId = params.categorySubId;
        }
        if(params.brandId){
            query += " and pi.brand_id = ${brandId} ";
            valueObj.brandId = params.brandId;
        }
        if(params.brandModelId){
            query += " and pi.brand_model_id = ${brandModelId} ";
            valueObj.brandModelId = params.brandModelId;
        }
        if(params.supplierId){
            query += " and spr.supplier_id = ${supplierId} ";
            valueObj.supplierId = params.supplierId;
        }
        query += " ) RETURNING id ";
        logger.debug(' addStorageCheckRelByProductRel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStorageCheckRel(params){
        const query = 'update storage_check_rel set op_user=${opUser} , remark=${remark} , ' +
            ' check_count=${checkCount} , status = ${status} , date_id = ${dateId} , ' +
            ' check_status = (' +
            ' select (case when scr.storage_count=${checkCount} then 1 else 2 end ) as check_status ' +
            ' from storage_check_rel scr ' +
            ' where id = ${storageCheckRelId} )' +
            ' where id =${storageCheckRelId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.checkCount = params.checkCount;
        valueObj.status = 2;
        valueObj.dateId = params.dateId;
        valueObj.checkCount = params.checkCount;
        valueObj.storageCheckRelId =params.storageCheckRelId;
        valueObj.storageCheckRelId =params.storageCheckRelId;
        logger.debug(' updateStorageCheckRel ');
        return await pgDb.any(query,valueObj);
    }

}

module.exports = StorageCheckRelDAO;