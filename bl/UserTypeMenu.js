
const userTypeMenuDAO = require('../models/UserTypeMenuDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserTypeMenu.js');

const queryUserTypeMenu = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await userTypeMenuDAO.queryUserTypeMenu(query);
        const count = await userTypeMenuDAO.queryUserTypeMenuCount(query);
        logger.info(' queryUserMenuList ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryUserTypeMenu error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addUserTypeMenu = async (req,res,next)=>{
    let params = req.body;
    params.status = sysConst.status.usable;
    try {
        if( params.id || params.id != undefined ){
            const rows = await userTypeMenuDAO.updateUserTypeMenu(params);
            console.log(rows);
            resUtil.resetUpdateRes(res,rows);
            logger.info(' addUserTypeMenu updateUserTypeMenu ' + 'success');
            return next();
        }else{
            const rows = await userTypeMenuDAO.addUserTypeMenu(params);
            resUtil.resetCreateRes(res,rows);
            logger.info(' addUserTypeMenu ' + 'success');
            return next();
        }
    }catch (e) {
        logger.error(" addUserTypeMenu error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.typeId){
        params.typeId = path.typeId;
    }
    try{
        const rows = await userTypeMenuDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryUserTypeMenu,
    addUserTypeMenu,
    updateStatus
}