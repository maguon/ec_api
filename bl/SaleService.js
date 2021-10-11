
const saleServiceDAO = require('../models/SaleServiceDAO');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SaleService.js');

const querySaleService = async (req,res,next)=>{
    let query = req.query;
    try{
        const rows = await saleServiceDAO.querySaleService(query);
        const count = await saleServiceDAO.querySaleServiceCount(query);
        logger.info(' querySaleService ' + 'success');
        resUtil.resetQueryRes(res,rows,count);
        return next();
    }catch (e) {
        logger.error(" querySaleService error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const querySaleServiceCsv = async (req,res,next)=>{
    let query = req.query;
    try {

        let csvString = "";
        const header = "ID" + ',' + "名称" + ',' + "服务类型" + ',' +
            "服务项目类型" + ',' + "销售类型" + ',' + "固定售价" + ',' + "销售单价" + ',' +
            "销售数量"+ ',' + "成本类型"+ ',' + "固定成本"+ ',' + "成本单价"+ ',' + "成本数量" + ',' +
            "总售价"+ ',' + "总成本"+ ',' + "毛利率";
        csvString = header + '\r\n' + csvString;
        let parkObj = {};
        const rows = await saleServiceDAO.querySaleService(query);

        for (let i = 0; i < rows.length; i++) {
            //ID
            if (rows[i].id == null) {
                parkObj.ID = '';
            } else {
                parkObj.ID = rows[i].id;
            }

            //名称
            if (rows[i].service_name == null) {
                parkObj.serviceName = '';
            } else {
                parkObj.serviceName = rows[i].service_name;
            }

            //服务类型
            if (rows[i].service_type == null) {
                parkObj.serviceType = '';
            } else {
                parkObj.serviceType = getServiceType(rows[i].service_type);
            }

            //服务项目类型
            if (rows[i].service_part_type == null) {
                parkObj.servicePartType = '';
            } else {
                parkObj.servicePartType = getServicePartType(rows[i].service_part_type);
            }

            //售价类型
            if (rows[i].service_price_type == null) {
                parkObj.servicePriceType = 0;
            } else {
                if(rows[i].service_price_type == 1){
                    parkObj.servicePriceType = '固定售价';
                }else if(rows[i].service_price_type == 2){
                    parkObj.servicePriceType = '单价数量';
                }
            }

            //固定售价
            if (rows[i].fixed_price == null) {
                parkObj.fixedPrice = 0;
            } else {
                parkObj.fixedPrice = rows[i].fixed_price;
            }

            //销售单价
            if (rows[i].unit_price == null) {
                parkObj.unitPrice = '';
            } else {
                parkObj.unitPrice = rows[i].unit_price;
            }

            //销售数量
            if (rows[i].service_price_count == null) {
                parkObj.servicePriceCount = '';
            } else {
                parkObj.servicePriceCount = rows[i].service_price_count;
            }

            //成本类型
            if (rows[i].service_cost_type == null) {
                parkObj.serviceCostType = '';
            } else {
                if(rows[i].service_cost_type == 1){
                    parkObj.serviceCostType = '固定售价';
                }else if(rows[i].service_cost_type == 2){
                    parkObj.serviceCostType = '单价数量';
                }
            }

            //固定成本
            if (rows[i].fixed_cost == null) {
                parkObj.fixedCost = 0;
            } else {
                parkObj.fixedCost = rows[i].fixed_cost;
            }

            //成本单价
            if (rows[i].unit_cost == null) {
                parkObj.unitCost = 0;
            } else {
                parkObj.unitCost = rows[i].unit_cost;
            }

            //成本数量
            if (rows[i].service_cost_count == null) {
                parkObj.serviceCostCount = 0;
            } else {
                parkObj.serviceCostCount = rows[i].service_cost_count;
            }

            //总售价
            if (rows[i].total_price == null) {
                parkObj.totalPrice = 0;
            } else {
                parkObj.totalPrice = rows[i].total_price;
            }

            //总成本
            if (rows[i].total_cost == null) {
                parkObj.totalCost = 0;
            } else {
                parkObj.totalCost = rows[i].total_cost;
            }

            //毛利率
            if (rows[i].total_profit == null) {
                parkObj.totalProfit = 0;
            } else {
                parkObj.totalProfit = rows[i].total_profit;
            }

            csvString = csvString + parkObj.ID + "," + parkObj.serviceName + "," + parkObj.serviceType + "," +
                parkObj.servicePartType + "," + parkObj.servicePriceType + "," + parkObj.fixedPrice + "," + parkObj.unitPrice + "," +
                parkObj.servicePriceCount +"," + parkObj.serviceCostType +"," + parkObj.fixedCost +"," +
                parkObj.unitCost+"," + parkObj.serviceCostCount+"," + parkObj.totalPrice+"," + parkObj.totalCost+"," + parkObj.totalProfit +'\r\n';
        }
        let csvBuffer = new Buffer(csvString, 'utf8');
        res.set('content-type', 'application/csv');
        res.set('charset', 'utf8');
        res.set('content-length', csvBuffer.length);
        res.writeHead(200);
        res.write(csvBuffer);//TODO
        res.end();
        return next(false);
        logger.info(' querySaleServiceCsv ' + 'success');

    }catch (e) {
        logger.error(" querySaleServiceCsv error",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const getServiceType = (type) => {
    let typeName;
    switch (type) {
        case 1:{
            typeName = '保养';
            break;
        }
        case 2:{
            typeName = '维修';
            break;
        }
        case 3:{
            typeName = '电焊';
            break;
        }
        case 4:{
            typeName = '电器';
            break;
        }
        default:{
            typeName = ' ';
            break;
        }
    }
    return typeName;
}

const getServicePartType = (type) => {
    let partTypeName;
    switch (type) {
        case 1:{
            partTypeName = '车身部分';
            break;
        }
        case 2:{
            partTypeName = '电焊部分';
            break;
        }
        case 3:{
            partTypeName = '液压部分';
            break;
        }
        case 4:{
            partTypeName = '电器部分';
            break;
        }
        case 5:{
            partTypeName = '气路部分';
            break;
        }
        case 6:{
            partTypeName = '发动机部分';
            break;
        }
        case 7:{
            partTypeName = '底盘部分';
            break;
        }
        case 8:{
            partTypeName = '轮胎部分';
            break;
        }
        case 9:{
            partTypeName = '其他部分';
            break;
        }
        default:{
            partTypeName = ' ';
            break;
        }
    }
    return partTypeName;
}

const addSaleService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    try {
        const rows = await saleServiceDAO.addSaleService(params);
        logger.info(' addSaleService ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" addSaleService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }
}

const updateSaleService = async (req,res,next)=>{
    let params = req.body;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.saleServiceId){
        params.saleServiceId = path.saleServiceId;
    }
    try{
        const rows = await saleServiceDAO.updateSaleService(params);
        logger.info(' updateSaleService ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateSaleService error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

const updateStatus = async (req,res,next)=>{
    let params = req.query;
    let path = req.params;
    if(path.userId){
        params.opUser = path.userId;
    }
    if(path.saleServiceId){
        params.saleServiceId = path.saleServiceId;
    }
    try{
        const rows = await saleServiceDAO.updateStatus(params);
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }catch (e) {
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    }

}

module.exports = {
    querySaleService,
    querySaleServiceCsv,
    getServiceType,
    getServicePartType,
    addSaleService,
    updateSaleService,
    updateStatus
}