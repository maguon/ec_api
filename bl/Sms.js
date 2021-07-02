
const userDAO = require('../models/UserDAO');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment');
const https = require('https');
const oauthUtil = require('../util/OAuthUtil.js');
const smsConfig = require('../config/SmsConfig');
const logger = serverLogger.createLogger('Sms.js');

const httpSend = (msg, callback) => {
    let today = new Date();
    let timeStampStr = moment(today).format('yyyyMMddhhmmss');

    let originSignStr = smsConfig.smsOptions.accountSID + smsConfig.smsOptions.accountToken + timeStampStr;
    let signature = encrypt.encryptByMd5NoKey(originSignStr);

    let originAuthStr = smsConfig.smsOptions.accountSID + ":" + timeStampStr;
    let auth = encrypt.base64Encode(originAuthStr);
    let url = "/2013-12-26/" + smsConfig.smsOptions.accountType + "/" +
        smsConfig.smsOptions.accountSID + "/" + smsConfig.smsOptions.action + "?sig=";

    url = url + signature;
    let postData = JSON.stringify(msg);
    let options = {
        host: smsConfig.smsOptions.server,
        port: smsConfig.smsOptions.port,
        path: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'Authorization': auth
        }
    };

    let httpsReq = https.request(options, function (result) {
        let data = "";
        result.setEncoding('utf8');
        result.on('data', function (d) {
            data += d;
        }).on('end', function () {
            let resObj = eval("(" + data + ")");
            logger.info("httpSend " + resObj);
            callback(null, resObj);
        }).on('error', function (e) {
            logger.error("httpSend " + e.message);
            callback(e, null);
        });

    });

    httpsReq.write(postData + "\n", 'utf-8');
    httpsReq.end();
    httpsReq.on('error', function (e) {
        callback(e, null)
    });
}

const sendSms = (params, callback) =>{
    let msg = {
        to: params.phone,
        appId: smsConfig.smsOptions.appSID,
        templateId: params.templateId,
        datas: [params.captcha, '15']
    };
    httpSend(msg, callback);
}

//验证用户存在，发送验证码
const passwordSms = async (req,res,next)=>{
    let path = req.params;

    try{
        //查询是否存在用户
        const rows = await userDAO.queryUser({phone:path.phone});
        logger.info(' passwordSms queryUser success');

        if(rows.length >= 1){
            //存在用户，发送验证码
            let captcha = encrypt.getSmsRandomKey();
            await oauthUtil.saveUserPhoneCode({phone:path.phone,code:captcha},function(error,result){
                if (error) {
                    resUtil.resetFailedRes(res,{message:'验证码发送失败！'});
                    logger.info(' passwordSms saveUserPhoneCode failure');
                    return next();
                } else {
                    console.log("phone"+path.phone+ "code"+captcha);
                    logger.info(' passwordSms saveUserPhoneCodes success');

                }
            });

            await sendSms({phone:path.phone,captcha:captcha,templateId:smsConfig.smsOptions.signTemplateId},function(error,result){
                if (error) {
                    resUtil.resetFailedRes(res,{message:'验证码发送失败！'});
                    logger.info(' passwordSms sendSms failure');
                    return next();
                } else {
                    console.log("phone"+path.phone+ "code"+captcha);
                    logger.info(' passwordSms sendSms success');
                    resUtil.resetUpdateRes(res,{id:1});
                    return next();
                }
            });

        }else{
            //不存在，返回提示
            resUtil.resetFailedRes(res,{message:'该用户不存在！'});
            logger.info(' passwordSms sendSms ' + ' phone null!');
            return next();
        }

    }catch (e) {
        logger.error(" passwordSms error ",e.stack);
        resUtil.resInternalError(e,res,next);
        return next();
    }

}


module.exports = {
    passwordSms
}