
const PaymentOrderRelDAO = require('../models/PaymentOrderRelDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const moment = require('moment');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('PaymentOrderRel.js');

const queryPaymentOrderRel = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await PaymentOrderRelDAO.queryPaymentOrderRel(query);
        const count = await PaymentOrderRelDAO.queryPaymentOrderRelCount(query);
        logger.info(' queryPaymentOrderRel ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch(e){
        logger.error(" queryPaymentOrderRel error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updatePaymentOrderRel = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.paymentOrderRelId ){
        params.paymentOrderRelId  = path.paymentOrderRelId ;
    }
    try{
        const rows = await PaymentOrderRelDAO.updatePaymentOrderRel(params);
        logger.info(' updatePaymentOrderRel ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updatePaymentOrderRel error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    queryPaymentOrderRel,
    updatePaymentOrderRel
}