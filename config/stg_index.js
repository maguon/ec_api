
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

module.exports = { loggerConfig, logLevel ,hosts ,pgConfig}
