
const userMenuListDAO = require('../models/UserMenuListDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserMenuList.js');

const queryUserMenuList = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await userMenuListDAO.queryUserMenuList(query);
        const count = await userMenuListDAO.queryUserMenuListCount(query);
        logger.info(' queryUserMenuList ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryUserMenuList error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addUserMenuList = async (req,res,next)=>{
    let params = req.body;
    try {
        const rows = await userMenuListDAO.addUserMenuList(params);
        logger.info(' addUserMenuList ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addUserMenuList error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryUserMenuList,
    addUserMenuList
}