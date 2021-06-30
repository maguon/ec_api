
const clientAgentDAO = require('../models/ClientAgentDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('ClientAgent.js');

const queryClientAgent = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await clientAgentDAO.queryClientAgent(query);
        const count = await clientAgentDAO.queryClientAgentCount(query);
        logger.info(' queryClientAgent ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryClientAgent error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addClientAgent = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    params.status = sysConst.status.usable;

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await clientAgentDAO.addClientAgent(params);
        logger.info(' addClientAgent ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addClientAgent error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateClientAgent = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientAgentId){
        params.clientAgentId = path.clientAgentId;
    }
    try{
        const rows = await clientAgentDAO.updateClientAgent(params);
        logger.info(' updatePurchase ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePurchase error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientAgentId ){
        params.clientAgentId  = path.clientAgentId ;
    }
    try{
        const rows = await clientAgentDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryClientAgent,
    addClientAgent,
    updateClientAgent,
    updateStatus
}