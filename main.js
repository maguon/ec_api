'use strict'
const myServer = require('./server');

(() =>{

    const server = myServer.createServer();
    server.listen(9911, () => {

        console.log('EC-API server has been  started ,listening at %s', server.url);
    });
})();
