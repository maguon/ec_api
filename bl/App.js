
const appDAO = require('../models/AppDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('App.js');

const queryApp = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await appDAO.queryApp(query);
        const count = await appDAO.queryAppCount(query);
        logger.info(' queryApp ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch(e){
        logger.error(" queryApp error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addApp = async (req,res,next)=>{
    let params = req.body;
    params.status = sysConst.status.usable;
    try{
        const rows = await appDAO.addApp(params);
        logger.info(' addApp ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addApp error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateApp = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.appId){
        params.appId = path.appId;
    }
    try{
        const rows = await appDAO.updateApp(params);
        logger.info(' updateApp ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateApp error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.appId){
        params.appId = path.appId;
    }
    try{
        const rows = await appDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteApp = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.appId){
        params.appId = path.appId;
    }
    try{
        const rows = await appDAO.deleteApp(params);
        logger.info(' deleteApp ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteApp error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryApp,
    addApp,
    updateApp,
    updateStatus,
    deleteApp
}