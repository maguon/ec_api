const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductDAO.js');

class ProductDAO  {
    static async queryProduct(params) {
        let query = "select pi.* , ui.real_name , ci.category_name , " +
            " csi.category_sub_name , bi.brand_name , bmi.brand_model_name" +
            " from product_info pi " +
            " left join user_info ui on ui.id = pi.op_user " +
            " left join category_info ci on ci.id = pi.category_id " +
            " left join category_sub_info csi on csi.id = pi.category_sub_id " +
            " left join brand_info bi on bi.id = pi.brand_id " +
            " left join brand_model_info bmi on bmi.id = pi.brand_model_id " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.productId){
            query += " and pi.id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.status){
            query += " and pi.status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.productName){
            query += " and pi.product_name like '%" + params.productName + "%' ";
        }
        if(params.productSName){
            query += " and pi.product_s_name like '%" + params.productSName + "%' ";
        }
        if(params.categoryId){
            query += " and pi.category_id = ${categoryId} ";
            filterObj.categoryId = params.categoryId;
        }
        if(params.categorySubId){
            query += " and pi.category_sub_id = ${categorySubId} ";
            filterObj.categorySubId = params.categorySubId;
        }
        if(params.brandId){
            query += " and pi.brand_id = ${brandId} ";
            filterObj.brandId = params.brandId;
        }
        if(params.brandModelId){
            query += " and pi.brand_model_id = ${brandModelId} ";
            filterObj.brandModelId = params.brandModelId;
        }
        if(params.standardType){
            query += " and pi.standard_type = ${standardType} ";
            filterObj.standardType = params.standardType;
        }
        query = query + '  order by pi.id desc ';
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        logger.debug(' queryProduct ');
        return await pgDb.any(query,filterObj);
    }

    static async queryProductCount(params) {
        let query = "select count(id) from product_info where id is not null ";
        let filterObj = {};
        if(params.productId){
            query += " and id = ${productId} ";
            filterObj.productId = params.productId;
        }
        if(params.status){
            query += " and status = ${status} ";
            filterObj.status = params.status;
        }
        if(params.productName){
            query += " and product_name like '%" + params.productName + "%' ";
        }
        if(params.productSName){
            query += " and product_s_name like '%" + params.productSName + "%' ";
        }
        if(params.categoryId){
            query += " and category_id = ${categoryId} ";
            filterObj.categoryId = params.categoryId;
        }
        if(params.categorySubId){
            query += " and category_sub_id = ${categorySubId} ";
            filterObj.categorySubId = params.categorySubId;
        }
        if(params.brandId){
            query += " and brand_id = ${brandId} ";
            filterObj.brandId = params.brandId;
        }
        if(params.brandModelId){
            query += " and brand_model_id = ${brandModelId} ";
            filterObj.brandModelId = params.brandModelId;
        }
        if(params.standardType){
            query += " and standard_type = ${standardType} ";
            filterObj.standardType = params.standardType;
        }
        logger.debug(' queryProductCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addProduct(params) {
        const query = 'INSERT INTO product_info (status , op_user , remark , product_name , product_s_name , ' +
            ' product_serial , product_address , category_id , category_sub_id , brand_id , brand_model_id , image , standard_type , ' +
            ' barcode , unit_name , price ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${productName} , ${productSName} , ${productSerial} ,' +
            ' ${productAddress} , ${categoryId} , ${categorySubId} , ${brandId} , ${brandModelId} , ${image} , ${standardType} ,' +
            ' ${barcode} , ${unitName} , ${price} ) RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.productName = params.productName;
        valueObj.productSName = params.productSName;
        valueObj.productSerial = params.productSerial;
        valueObj.productAddress = params.productAddress;
        valueObj.categoryId = params.categoryId;
        valueObj.categorySubId = params.categorySubId;
        valueObj.brandId = params.brandId;
        valueObj.brandModelId = params.brandModelId;
        valueObj.image = params.image;
        valueObj.standardType = params.standardType;
        valueObj.barcode = params.barcode;
        valueObj.unitName = params.unitName;
        valueObj.price = params.price;
        logger.debug(' addProduct ');
        return await pgDb.any(query,valueObj);
    }

    static async updateProduct(params){
        const query = 'update product_info set op_user=${opUser} , remark=${remark} , ' +
            ' product_name=${productName} ,  product_s_name=${productSName} , ' +
            ' product_serial=${productSerial} , product_address=${productAddress} , category_id=${categoryId} , ' +
            ' category_sub_id=${categorySubId} ,' +
            ' brand_id=${brandId} , brand_model_id=${brandModelId} , image=${image} , ' +
            ' standard_type=${standardType} , barcode=${barcode} , ' +
            ' unit_name=${unitName} , price=${price} ' +
            ' where id =${productId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.remark = params.remark;
        valueObj.productName = params.productName;
        valueObj.productSName = params.productSName;
        valueObj.productSerial =params.productSerial;
        valueObj.productAddress =params.productAddress;
        valueObj.categoryId =params.categoryId;
        valueObj.categorySubId =params.categorySubId;
        valueObj.brandId =params.brandId;
        valueObj.brandModelId =params.brandModelId;
        valueObj.image =params.image;
        valueObj.standardType =params.standardType;
        valueObj.barcode =params.barcode;
        valueObj.unitName =params.unitName;
        valueObj.price =params.price;
        valueObj.productId =params.productId;
        logger.debug(' updateProduct ');
        return await pgDb.any(query,valueObj);
    }

    static async updateStatus(params){
        const query = 'update product_info set status=${status} , op_user=${opUser} ' +
            ' where id=${productId} RETURNING id ';
        let valueObj = {};
        valueObj.status = params.status;
        valueObj.opUser = params.opUser;
        valueObj.productId = params.productId;
        logger.debug(' updateStatus ');
        return await pgDb.any(query,valueObj);
    }

    static async deleteProduct(params){
        const query = 'delete from product_info where id =${productId} RETURNING id ';
        let valueObj = {};
        valueObj.productId =params.productId;
        logger.debug(' deleteProduct ');
        return await pgDb.any(query,valueObj);
    }
}

module.exports = ProductDAO;