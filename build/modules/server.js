"use strict";
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
        const httpServer = http_1.default.createServer(this.app);
        //const httpsServer = https.createServer(this.credentials, this.app);
        httpServer.listen(port, () => {
            console.log(`HTTP Server running on port ${port}`);
            callback(this.app);
        });
        /*httpsServer.listen(443, () => {
          console.log("HTTP Server running on port 443");
          callback(this.app);
        });*/
        //SOCKET
        const socket = require("socket.io");
        const io = socket(httpServer, {
            cors: {
                origin: process.env.HOST,
                credentials: true
            },
        });
        global.onlineUsers = new Map();
        io.on("connection", (socket) => {
            console.log("user connected", socket.id);
            global.chatSocket = socket;
            socket.on("add-user", (user) => {
                console.log("add-user", { user });
                global.onlineUsers.set(user, socket.id);
                console.log(global.onlineUsers);
            });
            socket.on("send-msg", (data) => {
                console.log("sendmsg", { data });
                const sendUserSocket = global.onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("receive-msg", data.msg);
                }
            });
        });
        //END SOCKET
    }
    use() {
        new passport_1.default().init();
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, express_session_1.default)({
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
        }));
        this.app.use(passport_2.default.initialize());
        this.app.use(passport_2.default.session());
        this.app.use((0, connect_flash_1.default)());
        this.app.use(express_1.default.static(process.env.APP_PATH + "/ui"));
        this.app.use(express_1.default.json());
        /**
         * For Cors
         */
        this.app.use("*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With,ngsw-bypass");
            next();
        });
    }
}
exports.Server = Server;
