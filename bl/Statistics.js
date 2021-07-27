
const statisticsDAO = require('../models/StatisticsDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Statistics.js');

//采购统计
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

//用户统计
const queryClientStatByMonth = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await statisticsDAO.queryClientStatByMonth(query);
        logger.info(' queryClientStatByMonth ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryClientStatByMonth error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryClientStatByDay = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await statisticsDAO.queryClientStatByDay(query);
        logger.info(' queryClientStatByDay ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryClientStatByDay error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

//订单统计
const queryOrderStatByMonth = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await statisticsDAO.queryOrderStatByMonth(query);
        logger.info(' queryOrderStatByMonth ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryOrderStatByMonth error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryOrderStatByDay = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await statisticsDAO.queryOrderStatByDay(query);
        logger.info(' queryOrderStatByDay ' + 'success');
        resUtil.resetQueryRes(res,rows,1);
        return next();
    }catch (e) {
        logger.error(" queryOrderStatByDay error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPurchaseStatByMonth,
    queryPurchaseStatByDay,
    queryClientStatByMonth,
    queryClientStatByDay,
    queryOrderStatByMonth,
    queryOrderStatByDay
}