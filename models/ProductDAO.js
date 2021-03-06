const pgDb = require('../db/connections/PgConnection');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductDAO.js');

class ProductDAO  {
    static async queryProduct(params) {
        let query = "select pi.* , ui.real_name , ci.category_name , " +
            " csi.category_sub_name , bi.brand_name , bmi.brand_model_name , COALESCE(sum(spr.storage_count),0) as storage_count " +
            " from product_info pi " +
            " left join user_info ui on ui.id = pi.op_user " +
            " left join category_info ci on ci.id = pi.category_id " +
            " left join category_sub_info csi on csi.id = pi.category_sub_id " +
            " left join brand_info bi on bi.id = pi.brand_id " +
            " left join brand_model_info bmi on bmi.id = pi.brand_model_id " +
            " left join storage_product_rel spr on spr.product_id = pi.id " +
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
        if(params.priceType){
            query += " and pi.price_type = ${priceType} ";
            filterObj.priceType = params.priceType;
        }
        query = query + ' group by pi.id, ui.id,ci.id,csi.id,bi.id,bmi.id ' +
            ' order by pi.id desc ';
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
        let query = "SELECT COUNT(group_pi.*) FROM ( select count(pi.id) " +
            " from product_info pi " +
            " left join user_info ui on ui.id = pi.op_user " +
            " left join category_info ci on ci.id = pi.category_id " +
            " left join category_sub_info csi on csi.id = pi.category_sub_id " +
            " left join brand_info bi on bi.id = pi.brand_id " +
            " left join brand_model_info bmi on bmi.id = pi.brand_model_id " +
            " left join storage_product_rel spr on spr.product_id = pi.id " +
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
        if(params.priceType){
            query += " and pi.price_type = ${priceType} ";
            filterObj.priceType = params.priceType;
        }
        query = query + ' group by pi.id, ui.id,ci.id,csi.id,bi.id,bmi.id ' +
            ' order by pi.id desc ) group_pi';
        logger.debug(' queryProductCount ');
        return await pgDb.one(query,filterObj);
    }

    static async queryMatchModel(params) {
        let query = "select pi.* , pmm.id as match_model_id , pmm.match_model_name , " +
            " pmb.id as match_brand_id , pmb.brand_name as match_brand_name " +
            " from product_info pi " +
            " LEFT JOIN prod_match_model pmm ON array[pmm.id] && pi.match_model " +
            " LEFT JOIN prod_match_brand pmb ON pmb.id = pmm.match_brand_id " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.productId){
            query += " and pi.id = ${productId} ";
            filterObj.productId = params.productId;
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
        logger.debug(' queryMatchModel ');
        return await pgDb.any(query,filterObj);
    }

    static async queryMatchModelCount(params) {
        let query = "select count(pi.id) " +
            " from product_info pi " +
            " LEFT JOIN prod_match_model pmm ON array[pmm.id] && pi.match_model " +
            " LEFT JOIN prod_match_brand pmb ON pmb.id = pmm.match_brand_id " +
            " where pi.id is not null ";
        let filterObj = {};
        if(params.productId){
            query += " and pi.id = ${productId} ";
            filterObj.productId = params.productId;
        }
        logger.debug(' queryMatchModelCount ');
        return await pgDb.one(query,filterObj);
    }

    static async addProduct(params) {
        const query = 'INSERT INTO product_info (status , op_user , remark , product_name , product_s_name , ' +
            ' product_serial , product_address , category_id , category_sub_id , brand_id , brand_model_id , image , standard_type , ' +
            ' barcode , unit_name , price_type , price , fixed_price , price_raise_ratio , price_raise_value , last_purchase_price , ' +
            ' storage_min , storage_max ) ' +
            ' VALUES (${status} , ${opUser} , ${remark} , ${productName} , ${productSName} , ${productSerial} ,' +
            ' ${productAddress} , ${categoryId} , ${categorySubId} , ${brandId} , ${brandModelId} , ${image} , ${standardType} ,' +
            ' ${barcode} , ${unitName} , ${priceType} , ${price} , ${fixedPrice} , ${priceRaiseRatio} , ${priceRaiseValue} , ${lastPurchasePrice} ,' +
            ' ${storageMin} , ${storageMax} ) RETURNING id ';
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
        valueObj.priceType = params.priceType;
        if(params.priceType == 1 ){
            valueObj.price = params.fixedPrice;
        }else if(params.priceType == 2){
            valueObj.price = Number(params.lastPurchasePrice) * Number(params.priceRaiseRatio) ;
        }else if(params.priceType == 3){
            valueObj.price = Number(params.lastPurchasePrice) + Number(params.priceRaiseValue) ;
        }else{
            valueObj.price = 0;
        }
        valueObj.fixedPrice = params.fixedPrice;
        valueObj.priceRaiseRatio = params.priceRaiseRatio;
        valueObj.priceRaiseValue = params.priceRaiseValue;
        valueObj.lastPurchasePrice = params.lastPurchasePrice;
        valueObj.storageMin = params.storageMin;
        valueObj.storageMax = params.storageMax;
        logger.debug(' addProduct ');
        return await pgDb.any(query,valueObj);
    }

    static async updateProduct(params){
        let query = 'update product_info set op_user=${opUser} , remark=${remark} , ' +
            ' product_name=${productName} ,  product_s_name=${productSName} , ' +
            ' product_serial=${productSerial} , product_address=${productAddress} , category_id=${categoryId} , ' +
            ' category_sub_id=${categorySubId} ,' +
            ' brand_id=${brandId} , brand_model_id=${brandModelId} , image=${image} , ' +
            ' standard_type=${standardType} , barcode=${barcode} , ' +
            ' unit_name=${unitName} , price_type=${priceType} , ' ;
        let valueObj = {};
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
        valueObj.priceType = params.priceType;

        if( params.priceType == 1 ){
            query = query + ' price = ${fixedPrice} , ';
            valueObj.fixedPrice = params.fixedPrice;
        }else if(params.priceType == 2){
            query = query + ' price = last_purchase_price * ${priceRaiseRatio} , ';
            valueObj.priceRaiseRatio = params.priceRaiseRatio;
        }else if(params.priceType == 3){
            query = query + ' price = last_purchase_price + ${priceRaiseValue} , ';
            valueObj.priceRaiseValue = params.priceRaiseValue;
        }else{
            query = query + ' price = 0 , ';
        }

        query = query +
            ' fixed_price=${fixedPrice} , price_raise_ratio=${priceRaiseRatio} ,' +
            ' price_raise_value=${priceRaiseValue} , storage_min=${storageMin} , storage_max=${storageMax} ' +
            ' where id =${productId} RETURNING id ';

        valueObj.fixedPrice = params.fixedPrice;
        valueObj.priceRaiseRatio = params.priceRaiseRatio;
        valueObj.priceRaiseValue = params.priceRaiseValue;
        valueObj.storageMin = params.storageMin;
        valueObj.storageMax = params.storageMax;
        valueObj.productId = params.productId;
        logger.debug(' updateProduct ');
        return await pgDb.any(query,valueObj);
    }

    static async updateMatchModel(params){
        const query = 'update product_info set op_user=${opUser} , match_model=${matchModel} ' +
            ' where id =${productId} RETURNING id ';
        let valueObj = {};
        valueObj.opUser = params.opUser;
        valueObj.matchModel = params.matchModel;
        valueObj.productId =params.productId;
        logger.debug(' updateMatchModel ');
        return await pgDb.any(query,valueObj);
    }

    static async updateLastPrice(params){
        const query = ' update product_info pti ' +
            ' set last_purchase_price = pci.unit_cost ,' +
            ' price = ( case ' +
            ' when price_type = 1 then fixed_price ' +
            ' when price_type = 2 then  pci.unit_cost * price_raise_ratio ' +
            ' when price_type = 3 then  pci.unit_cost + price_raise_value ' +
            ' end )' +
            ' from purchase_item pci ' +
            ' where pci.product_id = pti.id and pci.purchase_id = ${purchaseId} ' +
            ' RETURNING pti.id ';
        let valueObj = {};
        valueObj.purchaseId = params.purchaseId;
        logger.debug(' updateLastPrice ');
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

    static async queryProdStoreWarning(params) {
        let query = " select pi.*,sum(spl.storage_count) as storage_count ,pi.storage_min,pi.storage_max " +
            " from product_info pi " +
            " left join storage_product_rel spl on pi.id = spl.product_id " +
            " where spl.status = 1 and pi.status = 1 " ;
        let filterObj = {};
        if(params.productId){
            query += " and pi.id = ${productId} ";
            filterObj.productId = params.productId;
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
        if(params.priceType){
            query += " and pi.price_type = ${priceType} ";
            filterObj.priceType = params.priceType;
        }
        query = query + " group by pi.id " +
        " having sum(spl.storage_count) < pi.storage_min or sum(spl.storage_count) > pi.storage_max ";
        logger.debug(' queryProdStoreWarning ');
        return await pgDb.any(query,filterObj);
    }
}

module.exports = ProductDAO;