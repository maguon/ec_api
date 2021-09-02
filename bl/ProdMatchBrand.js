
const prodMatchBrandDAO = require('../models/ProdMatchBrandDAO');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('ProdMatchBrand.js');

const queryProdMatchBrand = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await prodMatchBrandDAO.queryProdMathBrand(query);
        const count = await prodMatchBrandDAO.queryProdMathBrandCount(query);
        logger.info(' queryProdMatchBrand ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryProdMatchBrand error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addProdMatchBrand = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    try {
        const rows = await prodMatchBrandDAO.addProdMathBrand(params);
        logger.info(' addProdMatchBrand ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addProdMatchBrand error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateProdMatchBrand = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.prodMatchBrandId ){
        params.prodMatchBrandId  = path.prodMatchBrandId ;
    }
    try{
        const rows = await prodMatchBrandDAO.updateProdMathBrand(params);
        logger.info(' updateProdMatchBrand ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateProdMatchBrand error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.prodMatchBrandId ){
        params.prodMatchBrandId  = path.prodMatchBrandId ;
    }
    try{
        const rows = await prodMatchBrandDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteProdMatchBrand = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.prodMatchBrandId ){
        params.prodMatchBrandId  = path.prodMatchBrandId ;
    }
    try{
        const rows = await prodMatchBrandDAO.deleteProdMathBrand(params);
        logger.info(' deleteProdMatchBrand ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteProdMatchBrand error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryProdMatchBrand,
    addProdMatchBrand,
    updateProdMatchBrand,
    updateStatus,
    deleteProdMatchBrand
}