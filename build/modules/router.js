"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const auth_controller_1 = __importDefault(require("../modules/controllers/auth-controller"));
const user_profile_controller_1 = require("../modules/controllers/user-profile-controller");
const express_1 = require("express");
const project_controller_1 = require("./controllers/project-controller");
const post_controller_1 = require("./controllers/post-controller");
const event_controller_1 = require("./controllers/event-controller");
const message_controller_1 = require("./controllers/message-controller");
const home_controller_1 = __importDefault(require("./controllers/home-controller"));
const user_recommendation_controller_1 = require("./controllers/user-recommendation-controller");
const company_controller_1 = __importDefault(require("./controllers/company-controller"));
const profile_controller_1 = __importDefault(require("./controllers/profile-controller"));
const search_controller_1 = require("./controllers/search-controller");
const follower_controller_1 = require("./controllers/follower-controller");
const blog_controller_1 = __importDefault(require("./controllers/blog-controller"));
const passport_1 = __importDefault(require("passport"));
const invite_beta_controller_1 = __importDefault(require("./controllers/invite-beta-controller"));
const bootstra_data_controller_1 = __importDefault(require("./controllers/bootstra-data-controller"));
class Router {
    constructor(app) {
        this.app = app;
    }
    listen() {
        this.createRoute("auth", auth_controller_1.default);
        this.createRoute("user-profile", user_profile_controller_1.UserProfileController);
        this.createRoute("project", project_controller_1.ProjectController);
        this.createRoute("posts", post_controller_1.PostController);
        this.createRoute("event", event_controller_1.EventController);
        this.createRoute("message", message_controller_1.MessageController);
        this.createRoute("home", home_controller_1.default);
        this.createRoute("user-recommendation", user_recommendation_controller_1.UserRecommentationController);
        this.createRoute("company", company_controller_1.default);
        this.createRoute("profile", profile_controller_1.default);
        this.createRoute("search", search_controller_1.SearchController);
        this.createRoute("followers", follower_controller_1.FollowerController);
        this.createRoute("blog", blog_controller_1.default);
        this.createRoute("invite-beta", invite_beta_controller_1.default);
        this.createRoute("", bootstra_data_controller_1.default);
        // init upload controler
        // new UploadController(this.app).listen();
    }
    createRoute(path = null, controller) {
        try {
            const router = (0, express_1.Router)();
            const createdController = new controller();
            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(createdController)).filter((method) => {
                return method !== "constructor" && method !== "listen";
            });
            for (let method of methods) {
                const hasGetDecorator = Reflect.getMetadata("isRequestDecorator", createdController, method);
                if (hasGetDecorator) {
                    // Call the method
                    createdController[method](router);
                    console.log("GET", method);
                }
            }
            createdController.listen(router);
            if (path) {
                this.app.use("/api/" + path, router);
                this.app.use("/api/v1/" + path, passport_1.default.authenticate("bearer", { session: false }), router);
            }
            else {
                this.app.use("/api/v1/", passport_1.default.authenticate("bearer", { session: false }), router);
                this.app.use("/api/", router);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    error(res) {
        res.send({ success: false });
    }
}
exports.Router = Router;
