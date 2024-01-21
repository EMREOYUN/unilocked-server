"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const passport_1 = __importDefault(require("../config/passport"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const express_session_1 = __importDefault(require("express-session"));
const passport_2 = __importDefault(require("passport"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const socket_io_1 = __importDefault(require("socket.io"));
const socket_1 = require("./socket");
const sticky_1 = require("@socket.io/sticky");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
class Server {
    /*private privateKey = fs.readFileSync(
      "C:/Certbot/live/tau-video.xyz/privkey.pem",
      "utf8"
    );
    private certificate = fs.readFileSync(
      "C:/Certbot/live/tau-video.xyz/cert.pem",
      "utf8"
    );
    private ca = fs.readFileSync(
      "C:/Certbot/live/tau-video.xyz/chain.pem",
      "utf8"
    );
  
    private credentials = {
      key: this.privateKey,
      cert: this.certificate,
      ca: this.ca,
    };*/
    constructor() {
        this.app = (0, express_1.default)();
        this.use();
    }
    listen(port, callback) {
        //const httpsServer = https.createServer(this.credentials, this.app);
        this.httpServer.listen(port, () => {
            console.log(`HTTP Server running on port ${port}`);
            callback(this.app);
        });
        /*httpsServer.listen(443, () => {
          console.log("HTTP Server running on port 443");
          callback(this.app);
        });*/
    }
    use() {
        new passport_1.default().init();
        this.app.use(express_1.default.urlencoded({ extended: false }));
        const sessionMiddleware = (0, express_session_1.default)({
            secret: "FbIapNWj9cAALnpyoiShmrf522IsKruO",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: false,
                secure: false,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            },
            store: connect_mongo_1.default.create({
                mongoUrl: process.env.DATABASE,
            }),
        });
        this.app.use(sessionMiddleware);
        this.app.use(passport_2.default.initialize());
        this.app.use(passport_2.default.session());
        this.app.use((0, connect_flash_1.default)());
        this.app.use(express_1.default.static(process.env.APP_PATH + "/ui"));
        this.app.use(express_1.default.json());
        this.httpServer = http_1.default.createServer(this.app);
        this.io = new socket_io_1.default.Server(this.httpServer, {
            transports: ["websocket"],
        });
        const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
        const subClient = pubClient.duplicate();
        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
            this.io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            (0, sticky_1.setupWorker)(this.io);
        });
        this.io
            .use(function (socket, next) {
            // Wrap the express middleware
            sessionMiddleware(socket.request, {}, next);
        })
            .use(function (socket, next) {
            // Wrap the passport middleware
            passport_2.default.initialize()(socket.request, {}, next);
        })
            .use(function (socket, next) {
            // Wrap the passport session middleware
            passport_2.default.session()(socket.request, {}, next);
        })
            .use(function (socket, next) {
            // Verify user
            if (socket.request.user) {
                next();
            }
            else {
                next(new Error("unauthorized"));
            }
        })
            .on("connection", function (socket) {
            return __awaiter(this, void 0, void 0, function* () {
                (0, socket_1.initSocketController)(socket);
            });
        });
        /**
         * For Cors
         */
        this.app.use("*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With,ngsw-bypass,tus-resumable, upload-length, upload-metadata");
            next();
        });
    }
}
exports.Server = Server;
