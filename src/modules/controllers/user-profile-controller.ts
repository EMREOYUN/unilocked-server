import { Router } from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import ensureAuthorized from "../middleware/ensure-authorized";
import success from "../responses/success";
import PaginateService from "../services/paginate";
import BaseController from "./base-controller";
import { UserController } from "./user-controller";
import { UserModel } from "../../resolved-models";

export class UserProfileController extends BaseController {
  listen(router: Router): void {
    router.get(
      "/:username",
      ensureAuthorized("users.view"),
      param("username").isString().isLength({ min: 2 }),
      async (req, res, next) => {
        const user = await this.byUserName(req.params.username);
        res.send({
          sucess: true,
          data: user.toObject(),
        });
        next();
      }
    );

    router.get("/", ensureAuthorized("users.view"), async (req, res, next) => {
      const users = await UserModel.find();

      res.send(success(await PaginateService.paginate(req, UserModel, users)));
      next();
    });

    router.get(
      "/:username/savedposts",
      ensureAuthorized("users.view"),
      param("username").isString().isLength({ min: 2 }),
      async (req, res, next) => {
        if (
          req.user._id.toString() !==
          (await this.byUserName(req.params.username)).id
        ) {
          res.status(403).send("The user does not have the permission.");
          next();
        } else {
          const posts = await this.getSavedPosts(
            req.user._id,
            req.query.page,
            req.query.perPage
          );
          res.send({
            success: true,
            data: posts,
          });
        }
        next();
      }
    );
  }

  public async byUserName(username: string) {
    const userController = new UserController();
    const user = await this.populate(userController.byUsername(username));
    return user;
  }

  public async populate(user, isMe = false) {
    const populateFields = [
      {
        path: "university",
      },
      {
        path: "department",
      },
      {
        path: "posts",
      },
      {
        path: "jobs",
      },
      {
        path: "education",
        populate: {
          path : "department"
        }
      },
      {
        path: "followers",
      },
      {
        path: "following",
      },
      {
        path: "projectsParticipated",
      },
      {
        path: "featuredContent",
      },
    ];

    if (isMe) {
      populateFields.push({
        path: "settings",
      });
    }

    return user.populate(populateFields);
  }

  public async getSavedPosts(
    userID: mongoose.Types.ObjectId,
    reqPage,
    perPage
  ) {
    const page = parseInt((reqPage as string) || "1");

    return UserModel.findOne({ _id: userID })
      .select("postsSaved")
      .populate({
        path: "postsSaved",
        select: ["text", "image_url"],
        options: {
          limit: parseInt((perPage as string) || "15"),
          skip: (page - 1) * perPage,
        },
      })
      .exec();
  }
}
