
const saleServiceDAO = require('../models/SaleServiceDAO');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SaleService.js');

const querySaleService = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await saleServiceDAO.querySaleService(query);
        const count = await saleServiceDAO.querySaleServiceCount(query);
        logger.info(' querySaleService ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" querySaleService error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addSaleService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;
    try {
        const rows = await saleServiceDAO.addSaleService(params);
        logger.info(' addSaleService ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addSaleService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateSaleService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.saleServiceId){
        params.saleServiceId = path.saleServiceId;
    }
    try{
        const rows = await saleServiceDAO.updateSaleService(params);
        logger.info(' updateSaleService ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateSaleService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

module.exports = {
    querySaleService,
    addSaleService,
    updateSaleService
}