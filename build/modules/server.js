'use strict';
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.Server = void 0;
var passport_1 = __importDefault(require('..\\config\\passport'));
var express_1 = __importDefault(require('express'));
var fs_1 = __importDefault(require('fs'));
var http_1 = __importDefault(require('http'));
var https_1 = __importDefault(require('https'));
var express_session_1 = __importDefault(require('express-session'));
var passport_2 = __importDefault(require('passport'));
var connect_flash_1 = __importDefault(require('connect-flash'));
var Server = (function () {
    function Server(db) {
        this.db = db;
        this.privateKey = fs_1.default.readFileSync('C:/Certbot/live/tau-video.xyz/privkey.pem', 'utf8');
        this.certificate = fs_1.default.readFileSync('C:/Certbot/live/tau-video.xyz/cert.pem', 'utf8');
        this.ca = fs_1.default.readFileSync('C:/Certbot/live/tau-video.xyz/chain.pem', 'utf8');
        this.credentials = {
            key: this.privateKey,
            cert: this.certificate,
            ca: this.ca
        };
        this.app = (0, express_1.default)();
        this.use();
    }
    Server.prototype.listen = function (port, callback) {
        var _this = this;
        var httpServer = http_1.default.createServer(this.app);
        var httpsServer = https_1.default.createServer(this.credentials, this.app);
        httpServer.listen(80, function () {
            console.log('HTTP Server running on port 80');
        });
        httpsServer.listen(443, function () {
            console.log('HTTP Server running on port 443');
            callback(_this.app);
        });
    };
    Server.prototype.use = function () {
        new passport_1.default().init(this.db);
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, express_session_1.default)({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport_2.default.initialize());
        this.app.use(passport_2.default.session());
        this.app.use((0, connect_flash_1.default)());
        this.app.use(express_1.default.static(process.env.APP_PATH + '/ui'));
        this.app.use(express_1.default.json());
        /**
         * For Cors
         */
        this.app.use('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,ngsw-bypass');
            next();
        });
    };
    return Server;
})();
exports.Server = Server;