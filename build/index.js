"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connector_1 = require("./modules/connector");
const router_1 = require("./modules/router");
const express_1 = __importDefault(require("express"));
const server_1 = require("./modules/server");
const redis_1 = require("./modules/services/redis");
const express_partials_1 = __importDefault(require("express-partials"));
require("dotenv/config");
process.env.APP_PATH = "C:/Users/Administrator/Desktop/";
process.env.path = "C:/Users/Administrator/Desktop/";
const connector = new connector_1.Connector();
connector.connect(() => {
    const server = new server_1.Server();
    server.listen(3000, (app) => {
        redis_1.RedisService.init();
        app.set("views", __dirname + "/views");
        app.set("view engine", "ejs");
        app.use((0, express_partials_1.default)());
        const router = new router_1.Router(app);
        router.listen();
        app.use(express_1.default.static(__dirname + "/ui"));
        app.use("/storage", express_1.default.static(__dirname + "/ui/storage"));
        app.all("*", (req, res, next) => {
            res.sendFile("index.html", { root: __dirname + "/ui" });
        });
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send("Something broke!");
        });
    });
});
process
    .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
})
    .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
});
