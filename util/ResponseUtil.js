'use strict';
const sysError = require('./SystemError.js');
const sysMsg= require('./SystemMsg.js');

const resetQueryRes = (res,rows,count) =>{
    res.send(200,{success : true,rows,count});
}

const resetCreateRes = (res,rows) =>{
    res.send(200,{success : true,rows});
}

const resetUpdateRes = (res,rows)=>{
    if(rows && rows !=null){
        res.send(200,{success : true,rows});
    }else{
        res.send(200,{success : false,rows});
    }
}

const resetFailedRes = (res,error)=>{
    res.send(200,{success:false,msg:error.message});
}

const resInternalError = (error , res ,next) => {
    res.send(500,{err:error.message});
    return next();
}

module.exports = {
    resetQueryRes,resetCreateRes,resetUpdateRes ,resetFailedRes ,resInternalError
}