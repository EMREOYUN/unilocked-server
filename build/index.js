'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const connector_1 = require('./modules\\connector');
const router_1 = require('./modules\\router');
const server_1 = require('./modules\\server');
const redis_1 = require('./modules\\services\\redis');
require('dotenv/config');
process.env.APP_PATH = 'C:/Users/Administrator/Desktop/';
process.env.path = 'C:/Users/Administrator/Desktop/';
const connector = new connector_1.Connector();
connector.connect(() => {
    const server = new server_1.Server();
    server.listen(3000, app => {
        redis_1.RedisService.init();
        const router = new router_1.Router(app);
        router.listen();
    });
});
process.on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
}).on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
});