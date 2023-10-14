import PassportConfig from "../config/passport";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import { User } from "../models/user";
import MongoStore from "connect-mongo";

export class Server {
  private app;

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
    this.app = express();
    this.use();
  }

  public listen(port: number, callback: any) {
    const httpServer = http.createServer(this.app);
    //const httpsServer = https.createServer(this.credentials, this.app);

    httpServer.listen(port, () => {
      console.log(`HTTP Server running on port ${port}`);
      callback(this.app)
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

    global.onlineUsers = new Map<string, string>();

    io.on("connection", (socket: any) => {
      console.log("user connected", socket.id);
      global.chatSocket = socket;
      socket.on("add-user", (user: User) => {
        console.log("add-user", { user })
        global.onlineUsers.set(user, socket.id);
        console.log(global.onlineUsers);
      });

      socket.on("send-msg", (data: any) => {
        console.log("sendmsg", { data })
        const sendUserSocket = global.onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("receive-msg", data.msg);
        }
      });
    });
    //END SOCKET
  }

  private use() {
    new PassportConfig().init();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      session({
        secret: "FbIapNWj9cAALnpyoiShmrf522IsKruO",
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: false,
          secure: false,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        },
        store: MongoStore.create({
          mongoUrl: process.env.DATABASE,
        }),
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(flash());
    this.app.use(express.static(process.env.APP_PATH + "/ui"));
    this.app.use(express.json());

    /**
     * For Cors
     */
    this.app.use("*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With,ngsw-bypass"
      );
      next();
    });
  }
}
