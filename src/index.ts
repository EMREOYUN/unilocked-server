import { Session } from "express-session";
import { IncomingMessage } from "http";
import { Connector } from "./modules/connector";

import { Router } from "./modules/router";

import express, { Express } from "express";
import { Server } from "./modules/server";
import mongoose, { Mongoose } from "mongoose";
import { User as UserModel } from "./models/user";
import { RedisService } from "./modules/services/redis";
import http from "http";
import partials from "express-partials";

declare global {
  namespace Express {
    interface User extends UserModel {
      _id: mongoose.Types.ObjectId;
    }
  }
}

require("dotenv/config");

process.env.APP_PATH = "C:/Users/Administrator/Desktop/";
process.env.path = "C:/Users/Administrator/Desktop/";

const connector = new Connector();
connector.connect(() => {
  const server = new Server();
  server.listen(3000, (app: Express) => {
    RedisService.init();

    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(partials());

    const router = new Router(app);
    router.listen();

    app.use(express.static(__dirname + "/ui"));
    app.use("/storage", express.static(__dirname + "/ui/storage"));
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
