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
import socket, { Socket } from "socket.io";
import { initSocketController } from "./socket";
import { UserModel } from "../resolved-models";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";

declare module "express-session" {
  interface Session {
    passport?: { user?: Express.User };
  }
}

declare module "http" {
  interface IncomingMessage {
    user?: Express.User;
    session: session.Session;
  }
}

/*
 add session to IncomingMessage of socketio
 */
declare module "socket.io" {
  interface Socket {
    request: http.IncomingMessage;
  }
}

export class Server {
  private app;
  private httpServer: http.Server;
  private io: socket.Server;

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

  private use() {
    new PassportConfig().init();
    this.app.use(express.urlencoded({ extended: false }));
    const sessionMiddleware = session({
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
    });
    this.app.use(sessionMiddleware);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(flash());
    this.app.use(express.static(process.env.APP_PATH + "/ui"));
    this.app.use(express.json());
    this.httpServer = http.createServer(this.app);
    this.io = new socket.Server(this.httpServer);
    this.io.adapter(createAdapter());
    setupWorker(this.io);
    this.io
      .use(function (socket, next) {
        // Wrap the express middleware
        sessionMiddleware(socket.request as any, {} as any, next as any);
      })
      .use(function (socket, next) {
        // Wrap the passport middleware
        passport.initialize()(socket.request as any, {} as any, next as any);
      })
      .use(function (socket, next) {
        // Wrap the passport session middleware
        passport.session()(socket.request as any, {} as any, next as any);
      })
      .use(function (socket, next) {
        // Verify user
        if (socket.request.user) {
          next();
        } else {
          next(new Error("unauthorized"));
        }
      })
      .on("connection", async function (socket: Socket) {
        initSocketController(socket);
      });

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
