
const userPerfLevelDAO = require('../models/UserPerfLevelDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserPerfLevel.js');

const queryUserPerfLevel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await userPerfLevelDAO.queryUserPerfLevel(query);
        const count = await userPerfLevelDAO.queryUserPerfLevelCount(query);
        logger.info(' queryUserPerfLevel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryUserPerfLevel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addUserPerfLevel = async (req,res,next)=>{
    let params = req.body;
    try {
        const rows = await userPerfLevelDAO.addUserPerfLevel(params);
        logger.info(' addUserPerfLevel ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addUserPerfLevel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateUserPerfLevel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userPerfLevelId ){
        params.userPerfLevelId  = path.userPerfLevelId ;
    }
    try{
        const rows = await userPerfLevelDAO.updateUserPerfLevel(params);
        logger.info(' updateUserPerfLevel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateUserPerfLevel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userPerfLevelId){
        params.userPerfLevelId = path.userPerfLevelId;
    }
    try{
        const rows = await userPerfLevelDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryUserPerfLevel,
    addUserPerfLevel,
    updateUserPerfLevel,
    updateStatus
}