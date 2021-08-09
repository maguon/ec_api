
const paymentDAO = require('../models/PaymentDAO');
const orderPaymentRelDAO = require('../models/PaymentOrderRelDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Payment.js');

const queryPayment = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await paymentDAO.queryPayment(query);
        const count = await paymentDAO.queryPaymentCount(query);
        logger.info(' queryPayment ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch(e){
        logger.error(" queryPayment error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addPayment = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }

    try{
        //创建支付信息
        const rows = await paymentDAO.addPayment(params);
        logger.info(' addPayment ' + 'success');

        //创建关联信息
        params.paymentId = rows[0].id;
        const rowsRel = await orderPaymentRelDAO.addPaymentOrderRel(params);
        logger.info(' addPayment addPaymentOrderRel ' + 'success');

        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addPayment error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePayment = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.paymentId){
        params.paymentId = path.paymentId;
    }
    try{
        const rows = await paymentDAO.updatePayment(params);
        logger.info(' updatePayment ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePayment error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.paymentId){
        params.paymentId = path.paymentId;
    }
    if(params.status == 1){
        let today = new Date();
        let date = moment(today).format('YYYYMMDD');
        params.dateId = date;
    }

    try{
        const rows = await paymentDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deletePayment = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.paymentId){
        params.paymentId = path.paymentId;
    }
    try{
        const rows = await paymentDAO.deletePayment(params);

        if(rows.length >= 1){
            logger.info(' deletePayment ' + 'success');
            resUtil.resetUpdateRes(res,rows);
        }else{
            logger.info(' deletePayment ' + ' Delete failed! ');
            resUtil.resetFailedRes(res,{message:'删除失败！'});
        }
        return next();
    }catch (e) {
        logger.error(" deletePayment error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPayment,
    addPayment,
    updatePayment,
    updateStatus,
    deletePayment
}