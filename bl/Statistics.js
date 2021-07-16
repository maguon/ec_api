
const statisticsDAO = require('../models/StatisticsDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Statistics.js');

const queryPurchaseStatByMonth = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await statisticsDAO.queryPurchaseStatByMonth(query);
        logger.info(' queryPurchaseStatByMonth ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryPurchaseStatByMonth error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryPurchaseStatByDay = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await statisticsDAO.queryPurchaseStatByDay(query);
        logger.info(' queryPurchaseStatByDay ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryPurchaseStatByDay error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPurchaseStatByMonth,
    queryPurchaseStatByDay
}