
const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: {
        console: { type: 'console' } ,
        file : {
            "type": "file",
            "filename": "../ec_api.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    },
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}

const hosts = {
    auth:{
        host :"stg.myxxjs.com",
        port : 9009
    }
}

const pgConfig = {
    initOptions :{native:true},
    connectOptions :{
        host: 'localhost',
        port: 5432,
        database: 'ec_db',
        user: 'ec_user',
        password: 'myxxjs2016'
    }
}

const smsOptions = {
    action: 'SMS/TemplateSMS',
    accountType: 'Accounts',
    accountSID: '8aaf07085e6037fd015e6e6eb5e60254',
    accountToken: '8f987b4902314ad38024c4b0ced9f0b3',
    appSID: '8aaf07085e6037fd015e6e74ae830260',
    appToken: '8970618228fd7233d818a32709f11f6c',
    signTemplateId: 204915,
    server: 'app.cloopen.com',
    port: '8883'
};

module.exports = { loggerConfig, logLevel ,hosts ,pgConfig , smsOptions}
