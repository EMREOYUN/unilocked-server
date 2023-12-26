import AuthController from "../modules/controllers/auth-controller";
import BaseController from "../modules/controllers/base-controller";
import { UserProfileController } from "../modules/controllers/user-profile-controller";
import { Express, Response, Router as ExpressRouter } from "express";
import { ProjectController } from "./controllers/project-controller";
import { PostController } from "./controllers/post-controller";
import { EventController } from "./controllers/event-controller";
import { MessageController } from "./controllers/message-controller";

import HomeController from "./controllers/home-controller";
import { UserRecommentationController } from "./controllers/user-recommendation-controller";
import CompanyController from "./controllers/company-controller";
import { UploadController } from "./controllers/upload-controller";
import ProfileController from "./controllers/profile-controller";
import { SearchController } from "./controllers/search-controller";

import { FollowerController } from "./controllers/follower-controller";

import BlogController from "./controllers/blog-controller";
import passport from "passport";

export class Router {
  constructor(private app: Express) {}

  public listen() {
    this.createRoute("auth", AuthController);
    this.createRoute("user-profile", UserProfileController);
    this.createRoute("project", ProjectController);
    this.createRoute("posts", PostController);
    this.createRoute("event", EventController);
    this.createRoute("message", MessageController);
    this.createRoute("home", HomeController);
    this.createRoute("user-recommendation", UserRecommentationController);
    this.createRoute("company", CompanyController);
    this.createRoute("profile", ProfileController);
    this.createRoute("search", SearchController);
    this.createRoute("followers", FollowerController);
    this.createRoute("blog", BlogController);

    // init upload controler
    // new UploadController(this.app).listen();
  }

  public createRoute<Type extends BaseController>(
    path: string | null = null,
    controller: { new (): Type }
  ) {
    try {
      const router = ExpressRouter();
      const createdController = new controller();

      const methods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(createdController)
      ).filter((method) => {
        return method !== "constructor" && method !== "listen";
      });

      for (let method of methods) {
        const hasGetDecorator = Reflect.getMetadata(
          "isRequestDecorator",
          createdController,
          method
        );
        if (hasGetDecorator) {
          // Call the method
          (createdController as any)[method](router);
          console.log("GET", method);
        }
      }
      createdController.listen(router);

      if (path) {
        this.app.use("/secure/" + path, router);
        this.app.use(
          "/api/v1/" + path,
          passport.authenticate("bearer", { session: false }),
          router
        );
      } else {
        this.app.use(
          "/api/v1/",
          passport.authenticate("bearer", { session: false }),
          router
        );
        this.app.use("/secure/", router);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public error(res: Response) {
    res.send({ success: false });
  }
}
