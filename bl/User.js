
const userDAO = require('../models/UserDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserInfo.js');

const userLogin = async (req,res,next)=>{
    let params = req.body;
    params.password = encrypt.encryptByMd5NoKey(params.password);
    try{
        const rows = await userDAO.queryUser({phone:params.userName, password:params.password});
        if(rows && rows.length<1){
            logger.warn(' userLogin ' + params.userName + sysMsg.CUST_LOGIN_USER_PSWD_ERROR);
            resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_USER_PSWD_ERROR);
            return next();
        }else{
            let userInfo = {
                userId : rows[0].id,
                status : rows[0].status,
                type: rows[0].type
            }
            userInfo.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,userInfo.userId,userInfo.status);
            oAuthUtil.saveToken(userInfo,function(error,result){
                if(error){
                    logger.error('userLogin loginSaveToken ' + error.stack);
                    return next(sysError.InternalError(error.message,sysMsg.InvalidArgument));
                }else{
                    logger.info('userLogin loginSaveToken ' + userInfo.userId + " success");

                }
            });
            logger.info(' userLogin ' + 'success');
            resUtil.resetQueryRes(res,userInfo,null);
            return next();
        }
    }catch (e) {
        logger.error(" userLogin error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

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
    userLogin,
    queryUser,
    addUser,
    updateUser,
    updateStatus,
    deleteUser
}