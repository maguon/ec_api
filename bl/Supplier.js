
const supplierDAO = require('../models/SupplierDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Supplier.js');

const querySupplier = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await supplierDAO.querySupplier(query);
        const count = await supplierDAO.querySupplierCount(query);
        logger.info(' queryUserMenuList ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" querySupplier error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addSupplier = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    params.status = sysConst.status.usable;
    if(path.userId){
        params.opUser = path.userId;
    }
    try {
        const rows = await supplierDAO.addSupplier(params);
        resUtil.resetCreateRes(res,rows);
        logger.info(' addSupplier ' + 'success');
        return next();
    }catch (e) {
        logger.error(" addSupplier error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateSupplier = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.supplierId){
        params.supplierId = path.supplierId;
    }
    try{
        const rows = await supplierDAO.updateSupplier(params);
        logger.info(' updateSupplier ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateSupplier error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.supplierId){
        params.supplierId = path.supplierId;
    }
    try{
        const rows = await supplierDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const deleteSupplier = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.supplierId){
        params.supplierId = path.supplierId;
    }
    try{
        const rows = await supplierDAO.deleteSupplier(params);
        logger.info(' deleteSupplier ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" deleteSupplier error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

module.exports = {
    querySupplier,
    addSupplier,
    updateSupplier,
    updateStatus,
    deleteSupplier
}