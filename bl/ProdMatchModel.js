
const prodMatchModelDAO = require('../models/ProdMatchModelDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('ProdMatchModel.js');

const queryProdMatchModel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await prodMatchModelDAO.queryProdMatchModel(query);
        const count = await prodMatchModelDAO.queryProdMatchModelCount(query);
        logger.info(' queryProdMatchModel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryProdMatchModel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addProdMatchModel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    try {
        const rows = await prodMatchModelDAO.addProdMatchModel(params);
        logger.info(' addProdMatchModel ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addProdMatchModel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateProdMatchModel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.prodMatchModelId){
        params.prodMatchModelId = path.prodMatchModelId;
    }
    try{
        const rows = await prodMatchModelDAO.updateProdMatchModel(params);
        logger.info(' updateProdMatchModel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateProdMatchModel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.prodMatchModelId){
        params.prodMatchModelId = path.prodMatchModelId;
    }
    try{
        const rows = await prodMatchModelDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteProdMatchModel = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.prodMatchModelId){
        params.prodMatchModelId = path.prodMatchModelId;
    }
    try{
        const rows = await prodMatchModelDAO.deleteProdMatchModel(params);
        logger.info(' deleteProdMatchModel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteProdMatchModels error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryProdMatchModel,
    addProdMatchModel,
    updateProdMatchModel,
    updateStatus,
    deleteProdMatchModel
}