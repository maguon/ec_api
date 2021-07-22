
const clientDAO = require('../models/ClientDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Client.js');

const queryClient = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await clientDAO.queryClient(query);
        const count = await clientDAO.queryClientCount(query);
        logger.info(' queryClient ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryClient error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addClient = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await clientDAO.addClient(params);
        logger.info(' addClient ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addClient error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateClient = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientId){
        params.clientId = path.clientId;
    }
    try{
        const rows = await clientDAO.updateClient(params);
        logger.info(' updateClient ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateClient error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientId ){
        params.clientId  = path.clientId ;
    }
    try{
        const rows = await clientDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryClient,
    addClient,
    updateClient,
    updateStatus
}