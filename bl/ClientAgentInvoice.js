
const clientAgentInvoiceDAO = require('../models/ClientAgentInvoiceDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('ClientAgentInvoice.js');

const queryClientAgentInvoice = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await clientAgentInvoiceDAO.queryClientAgentInvoice(query);
        const count = await clientAgentInvoiceDAO.queryClientAgentInvoiceCount(query);
        logger.info(' queryClientAgentInvoice ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryClientAgentInvoice error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addClientAgentInvoice = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientAgentId){
        params.clientAgentId = path.clientAgentId;
    }
    params.status = sysConst.status.usable;

    try {
        const rows = await clientAgentInvoiceDAO.addClientAgentInvoice(params);
        logger.info(' addClientAgentInvoice ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addClientAgentInvoice error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateClientAgentInvoice = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientAgentInvoiceId){
        params.clientAgentInvoiceId = path.clientAgentInvoiceId;
    }
    try{
        const rows = await clientAgentInvoiceDAO.updateClientAgentInvoice(params);
        logger.info(' updateClientAgentInvoice ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateClientAgentInvoice error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryClientAgentInvoice,
    addClientAgentInvoice,
    updateClientAgentInvoice
}