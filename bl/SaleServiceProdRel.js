
const saleServiceProdRelDAO = require('../models/SaleServiceProdRelDAO');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SaleServiceProdRel.js');

const querySaleServiceProdRel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await saleServiceProdRelDAO.querySaleServiceProdRel(query);
        const count = await saleServiceProdRelDAO.querySaleServiceProdRelCount(query);
        logger.info(' querySaleServiceProdRel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" querySaleServiceProdRel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addSaleServiceProdRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.saleServiceId){
        params.saleServiceId = path.saleServiceId;
    }
    if(path.productId){
        params.productId = path.productId;
    }
    try {
        const rows = await saleServiceProdRelDAO.addSaleServiceProdRel(params);
        logger.info(' addSaleServiceProdRel ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addSaleServiceProdRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteServiceProdRel = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.saleServiceId){
        params.saleServiceId = path.saleServiceId;
    }
    if(path.productId){
        params.productId = path.productId;
    }
    try{
        const rows = await saleServiceProdRelDAO.deleteSaleServiceProdRel(params);
        logger.info(' deleteServiceProdRel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteServiceProdRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    querySaleServiceProdRel,
    addSaleServiceProdRel,
    deleteServiceProdRel
}