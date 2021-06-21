'use strict';
const SYS_AUTH_TOKEN_ERROR ="当前用户级别，不能完成此操作" ;
const SYS_INTERNAL_ERROR_MSG = "Web Service Internal Error.";

const CUST_LOGIN_USER_PSWD_ERROR = "登录用户名或密码错误" ; // Customer enter a wrong password on login
const CUST_SIGNUP_REGISTERED = "已被注册";//Cutomer do signup ,but the current phone has been exist in system.
const CUST_LOGIN_PSWD_ERROR = "登录密码错误" ; // Customer enter a wrong password on login



module.exports = {
    SYS_AUTH_TOKEN_ERROR,
    SYS_INTERNAL_ERROR_MSG,

    CUST_LOGIN_USER_PSWD_ERROR,
    CUST_SIGNUP_REGISTERED,
    CUST_LOGIN_PSWD_ERROR
}