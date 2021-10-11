
const clientDAO = require('../models/ClientDAO');
const serverLogger = require('../util/ServerLogger.js');
const moment = require('moment');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Client.js');

const queryClient = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await clientDAO.queryClient(query);
        const count = await clientDAO.queryClientCount(query);
        logger.info(' queryClient ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" queryClient error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const queryClientCsv = async (req,res,next)=>{
    let query = req.query;
    try {

        let csvString = "";
        const header = "ID" + ',' + "车牌号" + ',' + "VIN" + ',' +
            "电话" + ',' + "客户来源" + ',' + "客户集群" + ',' + "用户" + ',' +
            "地址"+ ',' + "品牌"+ ',' + "车型"+ ',' + "推荐人"+ ',' + "创建时间";
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await clientDAO.queryClient(query);

        for (let i = 0; i < rows.length; i++) {
            //ID
            if (rows[i].id == null) {
                parkObj.ID = '';
            } else {
                parkObj.ID = rows[i].id;
            }

            //车牌号
            if (rows[i].client_serial == null) {
                parkObj.clientSerial = '';
            } else {
                parkObj.clientSerial = rows[i].client_serial;
            }

            //VIN
            if (rows[i].client_serial_detail == null) {
                parkObj.clientSerialDetail = '';
            } else {
                parkObj.clientSerialDetail = rows[i].client_serial_detail;
            }

            //电话
            if (rows[i].tel == null) {
                parkObj.tel = '';
            } else {
                parkObj.tel = rows[i].tel;
            }

            //客户来源
            if (rows[i].source_type == null) {
                parkObj.sourceType = 0;
            } else {
                parkObj.sourceType = rows[i].source_type;
            }

            //客户集群
            if (rows[i].client_agent_name == null) {
                parkObj.clientAgentName = 0;
            } else {
                parkObj.clientAgentName = rows[i].client_agent_name;
            }

            //用户
            if (rows[i].name == null) {
                parkObj.name = '';
            } else {
                parkObj.name = rows[i].name;
            }

            //地址
            if (rows[i].address == null) {
                parkObj.address = '';
            } else {
                parkObj.address = rows[i].address;
            }

            //品牌
            if (rows[i].match_brand_name == null) {
                parkObj.matchBrandName = '';
            } else {
                parkObj.matchBrandName = rows[i].match_brand_name;
            }

            //车型
            if (rows[i].match_model_name == null) {
                parkObj.matchModelName = 0;
            } else {
                parkObj.matchModelName = rows[i].match_model_name;
            }

            //推荐人
            if (rows[i].refer_real_name == null) {
                parkObj.referRealName = '';
            } else {
                parkObj.referRealName = rows[i].refer_real_name;
            }

            //创建时间
            if (rows[i].date_id == null) {
                parkObj.dateId = '';
            } else {
                parkObj.dateId = rows[i].date_id;
            }

            csvString = csvString + parkObj.ID + "," + parkObj.clientSerial + "," + parkObj.clientSerialDetail + "," +
                parkObj.tel + "," + parkObj.sourceType + "," + parkObj.clientAgentName + "," + parkObj.name + "," +
                parkObj.address +"," + parkObj.matchBrandName +"," + parkObj.matchModelName +"," +
                parkObj.referRealName+"," + parkObj.dateId +'\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' queryClientCsv ' + 'success');

    }catch (e) {
        logger.error(" queryClientCsv error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const addClient = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }

    let today = new Date();
    let date = moment(today).format('YYYYMMDD');
    params.dateId = date;

    try {
        const rows = await clientDAO.addClient(params);
        logger.info(' addClient ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addClient error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateClient = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientId){
        params.clientId = path.clientId;
    }
    try{
        const rows = await clientDAO.updateClient(params);
        logger.info(' updateClient ' + 'success');

        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateClient error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.clientId ){
        params.clientId  = path.clientId ;
    }
    try{
        const rows = await clientDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}


module.exports = {
    queryClient,
    queryClientCsv,
    addClient,
    updateClient,
    updateStatus
}