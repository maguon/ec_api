
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
    queryProdStoreWarning,
    addProduct,
    updateProduct,
    updateMatchModel,
    updateStatus,
    deleteProduct
}