
const productDAO = require('../models/ProductDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Product.js');

const queryProduct = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await productDAO.queryProduct(query);
        const count = await productDAO.queryProductCount(query);
        logger.info(' queryProduct ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryProduct error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryMatchModel = async (req,res,next)=>{
    let query = req.query;
    let path = req.params;
    if(path.productId){
        query.productId = path.productId;
    }
    try{
        const rows = await productDAO.queryMatchModel(query);
        const count = await productDAO.queryMatchModelCount(query);
        logger.info(' queryMatchModel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryMatchModel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryProductCsv = async (req,res,next)=>{
    let query = req.query;
    try {

        let csvString = "";
        const header = "ID" + ',' + "商品分类" + ',' + "商品子分类" + ',' +
            "品牌" + ',' + "品牌型号" + ',' + "商品名称" + ',' + "标准类型" + ',' +
            "单位"+ ',' + "售价"+ ',' + "库存"+ ',' + "状态";
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await productDAO.queryProduct(query);

        for (let i = 0; i < rows.length; i++) {
            //ID
            if (rows[i].id == null) {
                parkObj.ID = '';
            } else {
                parkObj.ID = rows[i].id;
            }

            //商品分类
            if (rows[i].category_name == null) {
                parkObj.categoryName = '';
            } else {
                parkObj.categoryName = rows[i].category_name;
            }

            //商品子分类
            if (rows[i].category_sub_name == null) {
                parkObj.categorySubName = '';
            } else {
                parkObj.categorySubName = rows[i].category_sub_name;
            }

            //品牌
            if (rows[i].brand_name == null) {
                parkObj.brandName = '';
            } else {
                parkObj.brandName = rows[i].brand_name;
            }

            //品牌型号
            if (rows[i].brand_model_name == null) {
                parkObj.brandModelName = '';
            } else {
                parkObj.brandModelName = rows[i].brand_model_name;
            }

            //商品名称
            if (rows[i].product_name == null) {
                parkObj.productName = 0;
            } else {
                parkObj.productName = rows[i].product_name;
            }

            //标准类型
            if (rows[i].standard_type == null) {
                parkObj.standardType = '';
            } else {
                if(rows[i].standard_type == 1){
                    parkObj.standardType = '标准';
                }else{
                    parkObj.standardType = '非标准';
                }
            }

            //单位
            if (rows[i].unit_name == null) {
                parkObj.unitName = 0;
            } else {
                parkObj.unitName = rows[i].unit_name;
            }

            //售价
            if (rows[i].price == null) {
                parkObj.price = 0;
            } else {
                parkObj.price = rows[i].price;
            }

            //库存
            if (rows[i].storage_count == null) {
                parkObj.storageCount = 0;
            } else {
                parkObj.storageCount = rows[i].storage_count;
            }

            //状态
            if (rows[i].status == null) {
                parkObj.status = '';
            } else {
                if(rows[i].status == 1){
                    parkObj.status = '可用';
                }else{
                    parkObj.status = '停用';
                }
            }

            csvString = csvString + parkObj.ID + "," + parkObj.categoryName + "," + parkObj.categorySubName + "," +
                parkObj.brandName + "," + parkObj.brandModelName + "," + parkObj.productName + "," + parkObj.standardType +
                "," + parkObj.unitName +"," + parkObj.price +"," + parkObj.storageCount +"," + parkObj.status +'\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryProductCsv ' + 'success');

    }catch (e) {
        logger.error(" queryProductCsv error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryProdStoreWarning = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await productDAO.queryProdStoreWarning(query);
        logger.info(' queryProdStoreWarning ' + 'success');
        resUtil.resetQueryRes(res,rows,{count:1});
        return next();
    }catch (e) {
        logger.error(" queryProdStoreWarning error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addProduct = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await productDAO.addProduct(params);
        logger.info(' addProduct ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addProduct error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateProduct = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.productId){
        params.productId = path.productId;
    }
    try{
        const rows = await productDAO.updateProduct(params);
        logger.info(' updateProduct ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateProduct error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateMatchModel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.productId){
        params.productId = path.productId;
    }
    try{
        const rows = await productDAO.updateMatchModel(params);
        logger.info(' updateMatchModel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateMatchModel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.productId){
        params.productId = path.productId;
    }
    try{
        const rows = await productDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteProduct = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.productId){
        params.productId = path.productId;
    }
    try{
        const rows = await productDAO.deleteProduct(params);
        logger.info(' deleteProduct ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteProduct error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryProduct,
    queryMatchModel,
    queryProductCsv,
    queryProdStoreWarning,
    addProduct,
    updateProduct,
    updateMatchModel,
    updateStatus,
    deleteProduct
}