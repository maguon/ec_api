
const appDAO = require('../models/AppDAO');
const serverLogger = require('../util/ServerLogger.js');
const sysConst = require('../util/SystemConst.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('App.js');

const queryApp = (req,res,next)=>{
    let query = req.query;

    appDAO.queryApp(query).then((rows)=>{
        logger.info(' queryApp queryApp ' + 'success');
        return rows;
    }).then(rows=>{
        appDAO.queryAppCount(query).then(count=>{
            logger.info(' queryApp queryAppCount ' + 'success');
            resUtil.resetQueryRes(res,rows,count);
            return next();
        }).catch(e=>{
            logger.error(" queryApp queryAppCount  error",e.stack);
            resUtil.resInternalError(e,res,next);
        })
    }).catch(e=>{
        logger.error(" queryApp queryApp error",e.stack);
        resUtil.resInternalError(e,res,next);
    })


}

const addApp = (req,res,next)=>{
    let params = req.body;
    params.status = sysConst.status.usable;
    appDAO.addApp(params).then((rows)=>{
        logger.info(' addApp ' + 'success');
        resUtil.resetCreateRes(res,rows);
        return next();
    }).catch((e)=>{
        logger.error(" addApp error ",e.stack);
        resUtil.resInternalError(e,res,next);
    });
}

const updateApp = (req,res,next)=>{
    let params = req.body;
    let today = new Date();
    params.updated_on = today;
    let path = req.params;
    if(path.appId){
        params.appId = path.appId;
    }

    appDAO.updateApp(params).then((rows)=>{
        logger.info(' updateApp ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }).catch((e)=>{
        logger.error(" updateApp error ",e.stack);
        resUtil.resInternalError(e,res,next);
    });
}

const updateApps = (req,res,next)=>{
    let params = req.body;
    params = {...req.params};
    appDAO.queryUser(params).then((rows)=>{
        return rows;

    }).then(rows=>{
        (async()=>{
            let updatedRows=[]
            for(let i=0;i<rows.length;i++){
                if(rows[i].id>11){
                    const affectedRows = await  userDAO.updateUser({userId:rows[i].id});
                    updatedRows.push(affectedRows);

                }
            }
            res.send(200,{success : true,updatedRows});
            return next();
        })()
    }).catch((e)=>{
        res.send(500,{err:e.message});
        logger.error("error",e.stack);
    });

}

const updateStatus = (req,res,next)=>{
    let params = req.query;
    let today = new Date();
    params.updated_on = today;

    let path = req.params;
    if(path.appId){
        params.appId = path.appId;
    }

    appDAO.updateStatus(params).then((rows)=>{
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }).catch((e)=>{
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    });
}

const deleteApp = (req,res,next)=>{
    let params = req.query;

    let path = req.params;
    if(path.appId){
        params.appId = path.appId;
    }

    appDAO.deleteApp(params).then((rows)=>{
        logger.info(' updateStatus ' + 'success');
        resUtil.resetUpdateRes(res,rows);
        return next();
    }).catch((e)=>{
        logger.error(" updateStatus error ",e.stack);
        resUtil.resInternalError(e,res,next);
    });
}

module.exports = {
    queryApp,
    addApp,
    updateApp,
    updateApps,
    updateStatus,
    deleteApp
}