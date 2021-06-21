
const userDAO = require('../models/UserDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserInfo.js');

const queryUser = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await userDAO.queryUser(query);
        const count = await userDAO.queryUserCount(query);
        logger.info(' queryUser ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryUser error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addUser = async (req,res,next)=>{
    let params = req.body;
    params.status = sysConst.status.usable;
    params.password = encrypt.encryptByMd5NoKey(params.password);
    try {
        const rows = await userDAO.addUser(params);
        logger.info(' addUser ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addUser error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateUser = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.userId = path.userId;
    }
    try{
        const rows = await userDAO.updateUser(params);
        logger.info(' updateUser ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateUser error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.userId = path.userId;
    }
    try{
        const rows = await userDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteUser = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.userId = path.userId;
    }
    try{
        const rows = await userDAO.deleteUser(params);
        logger.info(' deleteUser ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteUser error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryUser,
    addUser,
    updateUser,
    updateStatus,
    deleteUser
}