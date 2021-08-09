
const paymentDAO = require('../models/PaymentDAO');
const orderPaymentRelDAO = require('../models/PaymentOrderRelDAO');
const orderDAO = require('../models/OrderDAO');
const orderRefundDAO = require('../models/OrderRefundDAO');
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

        //根据 rowsRel 返回结果， 更新order_info payment_status 为
        params.paymentStatus = sysConst.orderPaymentStatus.in;
        const rowsOrder = await orderDAO.updatePaymentStatus(params);
        logger.info(' addPayment orderInfo updatePaymentStatus ' + 'success');

        //根据 rowsRel 返回结果， 更新order_refund payment_status 为
        const rowsRefund = await orderRefundDAO.updatePaymentStatus(params);
        logger.info(' addPayment orderRefund updatePaymentStatus ' + 'success');

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
    if(path.userId){
        params.opUser = path.userId;
    }
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

        if(params.status == sysConst.paymentInfoStatus.complete){
            //更新 order_info payment_status = 7
            params.paymentStatus = sysConst.orderPaymentStatus.complete;
            let today = new Date();
            let date = moment(today).format('YYYYMMDD');
            params.finDateId = date;
            const rowsOrder = await orderDAO.updatePaymentStatus(params);
            logger.info(' updateStatus orderDAO updatePaymentStatus ' + 'success');

            //更新 order_refund payment_status = 7
            params.dateId = date;
            const rowsRefund = await orderRefundDAO.updatePaymentStatus(params);
            logger.info(' updateStatus orderRefundDAO updateStatusByPaymentId ' + 'success');
        }


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
    if(path.userId ){
        params.opUser = path.userId ;
    }
    if(path.paymentId){
        params.paymentId = path.paymentId;
    }
    try{
        //判断 payment_info 是否为已支付状态
        const rowsPayment = await paymentDAO.queryPayment({id:path.paymentId});
        logger.info(' deletePayment queryPayment ' + 'success');
        if(rowsPayment.length){
            if(rowsPayment[0].status == sysConst.paymentInfoStatus.complete){
                logger.info(' deletePayment ' + ' Delete status failed! ');
                resUtil.resetFailedRes(res,{message:'不允许删除该支付信息！'});
            }
        }

        //将 order_info 里的 payment_status 更改为 未支付 状态
        params.paymentStatus = sysConst.orderPaymentStatus.normal;
        const rowsOrder = await orderDAO.updatePaymentStatus(params);
        logger.info(' deletePayment orderInfo updatePaymentStatus ' + 'success');

        //将 order_refund 里的 payment_status 更改为 未支付 状态
        const rowsRefund = await orderRefundDAO.updatePaymentStatus(params);
        logger.info(' deletePayment orderRefund updatePaymentStatus ' + 'success');

        //删除 payment_order_rel 的关联信息
        const rowsRel = await orderPaymentRelDAO.deletePayment(params);
        logger.info(' deletePayment deletePayment ' + 'success');

        //删除支付信息
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